const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET - Fetch all competitions for a specific fest */
router.get('/fest/:festId', (req, res) => {
  const { festId } = req.params;

  const query = `
    SELECT 
      c.competition_id, 
      c.competition_name, 
      c.fest_id, 
      c.description, 
      c.type,
      c.competition_date,
      c.min_members,
      c.max_members,
      c.grouplimit,
      c.reg_fee,
      c.image,
      c.res_status,
      (
        SELECT COUNT(*)
        FROM tbl_competitionreg
        WHERE competitionid = c.competition_id
      ) AS reg_count
    FROM tbl_competitions c
    WHERE c.fest_id = ? 
    ORDER BY c.competition_id DESC
  `;
  
  db.query(query, [festId], (err, results) => {
    if (err) {
      console.error('Error fetching competitions:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching competitions'
      });
    }

    res.json({
      success: true,
      data: results || []
    });
  });
});

/* GET - Fetch participants for a specific competition */
router.get('/:compId/participants', (req, res) => {
  const { compId } = req.params;

  // First, get the competition type
  const compTypeQuery = 'SELECT type FROM tbl_competitions WHERE competition_id = ?';
  
  db.query(compTypeQuery, [compId], (err, compResults) => {
    if (err) {
      console.error('Error fetching competition type:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching competition details'
      });
    }

    if (!compResults || compResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

    const compType = compResults[0].type;

    // Fetch participants
    const query = `
      SELECT 
        p.participantid,
        p.participantname,
        p.participantemail,
        p.contact_no,
        p.participantimage,
        p.institution_id_proof,
        cr.attendance,
        cr.regdate,
        cr.competitionregid,
        cr.chessno
      FROM tbl_competitionreg cr
      JOIN tbl_participant p ON cr.participantid = p.participantid
      WHERE cr.competitionid = ?
      ORDER BY cr.regdate DESC
    `;

    db.query(query, [compId], (err, participants) => {
      if (err) {
        console.error('Error fetching participants:', err);
        return res.status(500).json({
          success: false,
          message: 'Error fetching participants'
        });
      }

      // If it's a group competition, fetch group members for each participant
      if (compType === 'group' && participants && participants.length > 0) {
        let processedCount = 0;
        const participantsWithGroupDetails = participants.map(p => ({
          ...p,
          groupMembers: []
        }));

        participants.forEach((participant, index) => {
          const groupMembersQuery = `
            SELECT 
              cgd.participantname,
              cgd.email,
              cgd.contact_no,
              cgd.collegeidproof,
              p.institution_name
            FROM tbl_competition_group_details cgd
            LEFT JOIN tbl_participant p ON cgd.email = p.participantemail
            WHERE cgd.competitionregid = ?
          `;

          db.query(groupMembersQuery, [participant.competitionregid], (err, groupMembers) => {
            if (!err && groupMembers) {
              participantsWithGroupDetails[index].groupMembers = groupMembers || [];
            }
            processedCount++;

            // When all group members are fetched, send response
            if (processedCount === participants.length) {
              res.json({
                success: true,
                data: participantsWithGroupDetails,
                isGroupCompetition: true
              });
            }
          });
        });
      } else {
        // Single competition or no participants
        res.json({
          success: true,
          data: participants || [],
          isGroupCompetition: false
        });
      }
    });
  });
});

/* POST - Create new competition */
router.post('/', (req, res) => {
  const {
    competition_name,
    fest_id,
    description,
    type,
    max_members,
    min_members,
    competition_date,
    grouplimit,
    reg_fee,
    image
  } = req.body;

  // Validation
  if (!competition_name || !fest_id) {
    return res.status(400).json({
      success: false,
      message: 'Competition name and fest ID are required'
    });
  }

  if (!type || !competition_date) {
    return res.status(400).json({
      success: false,
      message: 'Competition type and date are required'
    });
  }

  // Fetch fest details to validate competition date is within fest duration
  const festQuery = 'SELECT startdate, enddate FROM tbl_fests WHERE fest_id = ?';
  
  db.query(festQuery, [fest_id], (err, festResults) => {
    if (err) {
      console.error('Error fetching fest details:', err);
      return res.status(500).json({
        success: false,
        message: 'Error validating fest details'
      });
    }

    if (!festResults || festResults.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Festival not found'
      });
    }

    const fest = festResults[0];
    const compDate = new Date(competition_date);
    const startDate = new Date(fest.startdate);
    const endDate = new Date(fest.enddate);

    // Check if competition date is within fest duration
    if (compDate < startDate) {
      return res.status(400).json({
        success: false,
        message: `Competition date cannot be before the fest start date (${fest.startdate})`
      });
    }

    if (compDate > endDate) {
      return res.status(400).json({
        success: false,
        message: `Competition date cannot be after the fest end date (${fest.enddate})`
      });
    }

    // Determine max and min members based on type
    let finalMaxMembers, finalMinMembers;
    if (type === 'single') {
      finalMaxMembers = 1;
      finalMinMembers = 1;
    } else {
      finalMaxMembers = max_members || 1;
      finalMinMembers = min_members || 1;
    }

    const insertQuery = `
      INSERT INTO tbl_competitions 
      (competition_name, fest_id, description, type, max_members, min_members, competition_date, grouplimit, reg_fee, reg_date, res_status, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'pending', ?)
    `;

    db.query(
      insertQuery,
      [
        competition_name.trim(),
        fest_id,
        description || '',
        type,
        finalMaxMembers,
        finalMinMembers,
        competition_date,
        grouplimit || 1,
        reg_fee || 0,
        image || ''
      ],
      (err, results) => {
        if (err) {
          console.error('Error creating competition:', err);
          return res.status(500).json({
            success: false,
            message: 'Error creating competition',
            error: err.message
          });
        }

        res.status(201).json({
          success: true,
          message: 'Competition created successfully',
          competition_id: results.insertId
        });
      }
    );
  });
});

/* GET - Fetch a single competition by ID */
router.get('/:compId', (req, res) => {
  const { compId } = req.params;

  const query = `
    SELECT *
    FROM tbl_competitions
    WHERE competition_id = ?
  `;

  db.query(query, [compId], (err, results) => {
    if (err) {
      console.error('Error fetching competition:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching competition'
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Competition not found'
      });
    }

      const compData = results[0];
      const countQuery = 'SELECT COUNT(*) as regCount FROM tbl_competitionreg WHERE competitionid = ?';
      db.query(countQuery, [compId], (countErr, countResults) => {
          if (!countErr && countResults && countResults.length > 0) {
              compData.registrationCount = countResults[0].regCount;
          } else {
              compData.registrationCount = 0;
          }
          res.json({
            success: true,
            data: compData
          });
      });
    });
});

router.put('/:compId', (req, res) => {
  const { compId } = req.params;
  const {
    competition_name,
    description,
    type,
    max_members,
    min_members,
    competition_date,
    grouplimit,
    reg_fee,
    image
  } = req.body;

  // If competition_date is being updated, validate it
  if (competition_date !== undefined) {
    // First fetch the competition to get its fest_id
    db.query(
      'SELECT fest_id FROM tbl_competitions WHERE competition_id = ?',
      [compId],
      (err, compResults) => {
        if (err || !compResults || compResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Competition not found'
          });
        }

        const fest_id = compResults[0].fest_id;

        // Fetch fest details for date validation
        db.query(
          'SELECT startdate, enddate FROM tbl_fests WHERE fest_id = ?',
          [fest_id],
          (err, festResults) => {
            if (err || !festResults || festResults.length === 0) {
              return res.status(500).json({
                success: false,
                message: 'Error validating fest details'
              });
            }

            const fest = festResults[0];
            const compDate = new Date(competition_date);
            const startDate = new Date(fest.startdate);
            const endDate = new Date(fest.enddate);

            // Check if competition date is within fest duration
            if (compDate < startDate) {
              return res.status(400).json({
                success: false,
                message: `Competition date cannot be before the fest start date (${fest.startdate})`
              });
            }

            if (compDate > endDate) {
              return res.status(400).json({
                success: false,
                message: `Competition date cannot be after the fest end date (${fest.enddate})`
              });
            }

            // Proceed with update
            performUpdate();
          }
        );
      }
    );
  } else {
    performUpdate();
  }

  function performUpdate() {
    let updateFields = [];
    let updateValues = [];

    if (competition_name !== undefined) {
      updateFields.push('competition_name = ?');
      updateValues.push(competition_name.trim());
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (type !== undefined) {
      updateFields.push('type = ?');
      updateValues.push(type);
    }
    if (max_members !== undefined) {
      updateFields.push('max_members = ?');
      updateValues.push(max_members);
    }
    if (min_members !== undefined) {
      updateFields.push('min_members = ?');
      updateValues.push(min_members);
    }
    if (competition_date !== undefined) {
      updateFields.push('competition_date = ?');
      updateValues.push(competition_date);
    }
    if (grouplimit !== undefined) {
      updateFields.push('grouplimit = ?');
      updateValues.push(grouplimit);
    }
    if (reg_fee !== undefined) {
      updateFields.push('reg_fee = ?');
      updateValues.push(reg_fee);
    }
    if (image !== undefined) {
      updateFields.push('image = ?');
      updateValues.push(image);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateValues.push(compId);
    const updateQuery = `UPDATE tbl_competitions SET ${updateFields.join(', ')} WHERE competition_id = ?`;

    db.query(updateQuery, updateValues, (err, results) => {
      if (err) {
        console.error('Error updating competition:', err);
        return res.status(500).json({
          success: false,
          message: 'Error updating competition'
        });
      }

      res.json({
        success: true,
        message: 'Competition updated successfully'
      });
    });
  }
});

/* DELETE - Delete competition */
router.delete('/:compId', (req, res) => {
  const { compId } = req.params;

  const deleteQuery = 'DELETE FROM tbl_competitions WHERE competition_id = ?';
  
  db.query(deleteQuery, [compId], (err, results) => {
    if (err) {
      console.error('Error deleting competition:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting competition'
      });
    }

    res.json({
      success: true,
      message: 'Competition deleted successfully'
    });
  });
});

/* PUT - Update result status */
router.put('/:compId/result-status', (req, res) => {
  const { compId } = req.params;
  const { status } = req.body;

  if (!status || !['pending', 'published'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be "pending" or "published"'
    });
  }

  const updateQuery = 'UPDATE tbl_competitions SET res_status = ? WHERE competition_id = ?';

  db.query(updateQuery, [status, compId], (err, results) => {
    if (err) {
      console.error('Error updating result status:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating result status'
      });
    }

    res.json({
      success: true,
      message: `Competition result status updated to ${status}`,
      data: { status }
    });
  });
});

/* GET - Fetch participants with results for a specific competition */
router.get('/:compId/participants-with-results', (req, res) => {
  const { compId } = req.params;

  const query = `
    SELECT 
      cr.competitionregid as competition_reg_id,
      p.participantid,
      p.participantname,
      p.participantemail,
      p.contact_no,
      cr.competitionid as competition_id,
      r.result_id,
      r.position
    FROM tbl_competitionreg cr
    JOIN tbl_participant p ON cr.participantid = p.participantid
    LEFT JOIN tbl_result r ON cr.competitionregid = r.competition_reg_id AND cr.competitionid = r.competition_id
    WHERE cr.competitionid = ?
    ORDER BY cr.regdate DESC
  `;

  db.query(query, [compId], (err, results) => {
    if (err) {
      console.error('Error fetching participants with results:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching participants with results'
      });
    }

    res.json({
      success: true,
      data: results || []
    });
  });
});

/* POST - Save competition results */
router.post('/save-results', (req, res) => {
  const { results } = req.body;

  if (!results || !Array.isArray(results) || results.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Results array is required'
    });
  }

  // Validate positions to ensure no duplicates
  const positions = results
    .filter(r => r.position)
    .map(r => r.position);
  
  const duplicates = positions.filter((pos, index) => positions.indexOf(pos) !== index);
  if (duplicates.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Duplicate positions found: ${duplicates.join(', ')}`
    });
  }

  // Process results - insert or update
  let processedCount = 0;
  let errors = [];

  const processResult = (index) => {
    if (index >= results.length) {
      if (errors.length > 0) {
        return res.status(500).json({
          success: false,
          message: 'Some results could not be saved',
          errors
        });
      }

      return res.json({
        success: true,
        message: 'Results saved successfully',
        processedCount
      });
    }

    const result = results[index];
    const { competition_id, competition_reg_id, position } = result;

    if (!competition_id || !competition_reg_id) {
      errors.push(`Result at index ${index}: Missing competition_id or competition_reg_id`);
      return processResult(index + 1);
    }

    if (!position) {
      // If no position, skip this result (participant has no award)
      processedCount++;
      return processResult(index + 1);
    }

    // Check if result already exists
    const checkQuery = `
      SELECT result_id FROM tbl_result 
      WHERE competition_id = ? AND competition_reg_id = ?
    `;

    db.query(checkQuery, [competition_id, competition_reg_id], (err, existingResults) => {
      if (err) {
        errors.push(`Result at index ${index}: Database error`);
        return processResult(index + 1);
      }

      if (existingResults && existingResults.length > 0) {
        // Update existing result
        const updateQuery = `
          UPDATE tbl_result 
          SET position = ? 
          WHERE competition_id = ? AND competition_reg_id = ?
        `;

        db.query(updateQuery, [position, competition_id, competition_reg_id], (err) => {
          if (err) {
            errors.push(`Result at index ${index}: Failed to update`);
          } else {
            processedCount++;
          }
          return processResult(index + 1);
        });
      } else {
        // Insert new result
        const insertQuery = `
          INSERT INTO tbl_result (competition_id, competition_reg_id, position)
          VALUES (?, ?, ?)
        `;

        db.query(insertQuery, [competition_id, competition_reg_id, position], (err) => {
          if (err) {
            errors.push(`Result at index ${index}: Failed to insert`);
          } else {
            processedCount++;
          }
          return processResult(index + 1);
        });
      }
    });
  };

  processResult(0);
});

/* GET - Fetch all registrations */
router.get('/registrations/all', (req, res) => {
  const query = `
    SELECT 
      cr.competitionregid,
      cr.competitionid,
      cr.participantid,
      cr.attendance,
      cr.regdate,
      p.participantname,
      p.participantemail,
      p.contact_no
    FROM tbl_competitionreg cr
    LEFT JOIN tbl_participant p ON cr.participantid = p.participantid
    ORDER BY cr.regdate DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching registrations:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching registrations'
      });
    }

    res.json({
      success: true,
      data: results || []
    });
  });
});

/* Note: File upload endpoint is configured in app.js with multer middleware */


// POST - Register for A Competition
router.post('/register', (req, res) => {
  const { compId, participantId, type } = req.body;
  
  // Base check
  if (!compId || !participantId) {
    return res.status(400).json({ success: false, message: 'Missing compId or participantId' });
  }

  // Check if competition exists and get type
  const compQuery = 'SELECT type, reg_fee FROM tbl_competitions WHERE competition_id = ?';
  db.query(compQuery, [compId], (err, compResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });
    if (compResults.length === 0) return res.status(404).json({ success: false, message: 'Competition not found' });
    
    const regFee = compResults[0].reg_fee || 0;
    
    // Check if participant already registered
    const checkRegQuery = 'SELECT * FROM tbl_competitionreg WHERE competitionid = ? AND participantid = ?';
    db.query(checkRegQuery, [compId, participantId], (err, regResults) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });
      if (regResults.length > 0) return res.status(400).json({ success: false, message: 'Already registered for this competition' });

      // Insert main registration
      const insRegQuery = 'INSERT INTO tbl_competitionreg (competitionid, chessno, attendance, regdate, participantid) VALUES (?, 0, "absent", CURDATE(), ?)';
      db.query(insRegQuery, [compId, participantId], (err, insRegResult) => {
        if (err) return res.status(500).json({ success: false, message: 'Registration failed', error: err });
        
        const regId = insRegResult.insertId;

        // Insert into payment table
        const paymentQuery = 'INSERT INTO tbl_payment (payment_date, type, typeid, amount) VALUES (CURDATE(), "registration", ?, ?)';
        db.query(paymentQuery, [regId, regFee], (payErr) => {
           if (payErr) console.error('Payment record insert error:', payErr);
        });

        if (type === 'group') {
          try {
             let names = req.body['member_names[]'] || req.body['member_names'];
             let contacts = req.body['member_contacts[]'] || req.body['member_contacts'];
             let emails = req.body['member_emails[]'] || req.body['member_emails'];
             
             // Normalize to array if single string
             if (typeof names === 'string') names = [names];
             if (typeof contacts === 'string') contacts = [contacts];
             if (typeof emails === 'string') emails = [emails];
             
             if (names && names.length > 0) {
                const grpQuery = "INSERT INTO tbl_competition_group_details (participantname, collegeidproof, contact_no, email, competitionregid) VALUES ?";
                const values = [];
                for (let i = 0; i < names.length; i++) {
                   // Match file dynamically using prefix collegeidproof_ or use array indexing if multer mapped it
                   // If we use collegeidproof array, multer might have it in req.files
                   let idproof = '';
                   if (req.files) {
                     const f = req.files.find(f => f.fieldname === 'collegeidproof_' + i);
                     if (f) idproof = f.filename;
                   }
                   values.push([names[i], idproof, contacts[i], emails[i], regId]);
                }
                
                db.query(grpQuery, [values], (err) => {
                   if (err) return res.status(500).json({ success: false, message: 'Group details insert failed', error: err });
                   res.json({ success: true, message: 'Group registered successfully' });
                });
             } else {
                res.json({ success: true, message: 'Registered successfully, no group members added' });
             }
          } catch(e) {
             res.status(500).json({ success: false, message:'Group parsing error', error: e.message });
          }
        } else {
          res.json({ success: true, message: 'Registered successfully' });
        }
      });
    });
  });
});

module.exports = router;

