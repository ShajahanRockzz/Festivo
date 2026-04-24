const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* POST - Create New Fest */
router.post('/create', (req, res) => {
  const { fest_name, fest_description, category_id, fest_for, startdate, enddate, institution_id } = req.body;
  const parsedInstitutionId = parseInt(institution_id, 10);
  const festImage = req.files && req.files['fest_image'] ? req.files['fest_image'][0] : null;
  const brochureFile = req.files && req.files['brochure'] ? req.files['brochure'][0] : null;

  // Validation
  if (!fest_name || !fest_description || !category_id || !startdate || !enddate) {
    return res.status(400).json({
      success: false,
      message: 'Fest name, description, category, and dates are required'
    });
  }

  if (!parsedInstitutionId || Number.isNaN(parsedInstitutionId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid institution ID is required'
    });
  }

  // Validate fest name length
  if (fest_name.trim().length < 3 || fest_name.trim().length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Fest name must be between 3 and 50 characters'
    });
  }

  // Validate description length
  if (fest_description.trim().length < 20 || fest_description.trim().length > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Description must be between 20 and 1000 characters'
    });
  }

  // Check if image is provided
  if (!festImage) {
    return res.status(400).json({
      success: false,
      message: 'Fest cover image is required'
    });
  }

  // Validate dates
  const startDate = new Date(startdate);
  const endDate = new Date(enddate);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format'
    });
  }

  if (endDate <= startDate) {
    return res.status(400).json({
      success: false,
      message: 'End date must be after start date'
    });
  }

  // Get current date
  const regDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  // Insert new fest
  const insertQuery = `
    INSERT INTO tbl_fests (
      fest_name, fest_image, brochure, startdate, enddate, 
      fest_description, fest_for, institution_id, category_id, 
      reg_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [
      fest_name.trim(),
      festImage.filename,
      brochureFile ? brochureFile.filename : '',
      startdate,
      enddate,
      fest_description.trim(),
      fest_for || 'all',
      parsedInstitutionId,
      category_id,
      regDate,
      'inactive' // Default status
    ],
    (err, results) => {
      if (err) {
        console.error('Error inserting fest:', err);
        return res.status(500).json({
          success: false,
          message: 'Error creating fest'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Fest created successfully',
        fest_id: results.insertId
      });
    }
  );
});

/* GET - Fetch all fests for an institution */
router.get('/institution/:institutionId', (req, res) => {
  const { institutionId } = req.params;

  const query = 'SELECT * FROM tbl_fests WHERE institution_id = ? ORDER BY reg_date DESC';
  
  db.query(query, [institutionId], (err, results) => {
    if (err) {
      console.error('Error fetching fests:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching fests'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

/* GET - Fetch available fests for participants */
router.get('/available', (req, res) => {
  const query = `
    SELECT 
      f.*, 
      i.institution_name,
      c.category_name,
      (SELECT COUNT(*) FROM tbl_competitions comp WHERE comp.fest_id = f.fest_id) as event_count
    FROM tbl_fests f
    LEFT JOIN tbl_institution i ON f.institution_id = i.institution_id
    LEFT JOIN tbl_category c ON f.category_id = c.category_id
    WHERE f.status = 'active'
      AND f.startdate >= CURDATE()
      AND EXISTS (
        SELECT 1
        FROM tbl_subscription s
        WHERE s.institutionid = f.institution_id
          AND s.renewaldate >= CURDATE()
      )
    ORDER BY f.startdate DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching available fests:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching available fests'
      });
    }

    res.json({
      success: true,
      data: results || []
    });
  });
});

/* GET - Fetch single fest by ID */
router.get('/:festId', (req, res) => {
  const { festId } = req.params;

  const query = 'SELECT * FROM tbl_fests WHERE fest_id = ?';
  
  db.query(query, [festId], (err, results) => {
    if (err) {
      console.error('Error fetching fest:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching fest'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Fest not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

/* PUT - Update fest (partial update - only update provided fields) */
router.put('/:festId', (req, res) => {
  const { festId } = req.params;
  const { fest_name, fest_description, category_id, fest_for, startdate, enddate, status } = req.body;

  // Build dynamic UPDATE query - only update fields that are provided
  let updateFields = [];
  let updateValues = [];

  if (fest_name !== undefined) {
    updateFields.push('fest_name = ?');
    updateValues.push(fest_name);
  }
  if (fest_description !== undefined) {
    updateFields.push('fest_description = ?');
    updateValues.push(fest_description);
  }
  if (category_id !== undefined) {
    updateFields.push('category_id = ?');
    updateValues.push(category_id);
  }
  if (fest_for !== undefined) {
    updateFields.push('fest_for = ?');
    updateValues.push(fest_for);
  }
  if (startdate !== undefined) {
    updateFields.push('startdate = ?');
    updateValues.push(startdate);
  }
  if (enddate !== undefined) {
    updateFields.push('enddate = ?');
    updateValues.push(enddate);
  }
  if (status !== undefined) {
    updateFields.push('status = ?');
    updateValues.push(status);
  }

  // If no fields to update, return error
  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update'
    });
  }

  updateValues.push(festId);

  const updateQuery = `UPDATE tbl_fests SET ${updateFields.join(', ')} WHERE fest_id = ?`;

  db.query(updateQuery, updateValues, (err, results) => {
    if (err) {
      console.error('Error updating fest:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating fest'
      });
    }

    res.json({
      success: true,
      message: 'Fest updated successfully'
    });
  });
});

/* DELETE - Delete fest */
router.delete('/:festId', (req, res) => {
  const { festId } = req.params;

  const deleteQuery = 'DELETE FROM tbl_fests WHERE fest_id = ?';
  
  db.query(deleteQuery, [festId], (err, results) => {
    if (err) {
      console.error('Error deleting fest:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting fest'
      });
    }

    res.json({
      success: true,
      message: 'Fest deleted successfully'
    });
  });
});

/* GET - Check if institution has active subscription */
router.get('/check-subscription/:institutionId', (req, res) => {
  const { institutionId } = req.params;

  const query = `
    SELECT s.subscriptionid, s.planid, s.renewaldate, p.plan_name, p.days
    FROM tbl_subscription s
    JOIN tbl_plan p ON s.planid = p.plan_id
    WHERE s.institutionid = ? AND s.renewaldate >= CURDATE()
    ORDER BY s.renewaldate DESC
    LIMIT 1
  `;
  
  db.query(query, [institutionId], (err, results) => {
    if (err) {
      console.error('Error checking subscription:', err);
      return res.status(500).json({
        success: false,
        hasSubscription: false,
        message: 'Error checking subscription'
      });
    }

    if (results.length > 0) {
      res.json({
        success: true,
        hasSubscription: true,
        subscription: results[0],
        message: 'Institution has active subscription'
      });
    } else {
      res.json({
        success: true,
        hasSubscription: false,
        subscription: null,
        message: 'No active subscription found'
      });
    }
  });
});

/* GET - Fetch coordinators for a fest */
router.get('/:festId/coordinators', (req, res) => {
  const { festId } = req.params;

  // Get coordinators assigned to competitions in this fest
  const query = `
    SELECT DISTINCT c.coordinator_id as coord_id, c.name as coord_name, c.email as coord_email, c.contact_no as coord_phone
    FROM tbl_coordinators c
    INNER JOIN tbl_assign a ON c.coordinator_id = a.coordinator_id
    INNER JOIN tbl_competitions comp ON a.competition_id = comp.competition_id
    WHERE comp.fest_id = ?
    ORDER BY c.coordinator_id DESC
  `;
  
  db.query(query, [festId], (err, results) => {
    if (err) {
      console.error('Error fetching coordinators:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching coordinators'
      });
    }

    res.json({
      success: true,
      data: results || []
    });
  });
});

/* POST - Add coordinator to fest */
router.post('/:festId/coordinators', (req, res) => {
  const { festId } = req.params;
  const { coord_name, coord_email, coord_phone } = req.body;

  // Validation
  if (!coord_name || !coord_email || !coord_phone) {
    return res.status(400).json({
      success: false,
      message: 'All coordinator fields are required'
    });
  }

  const insertQuery = `
    INSERT INTO tbl_fest_coordinators (fest_id, coord_name, coord_email, coord_phone)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertQuery,
    [festId, coord_name.trim(), coord_email.trim(), coord_phone.trim()],
    (err, result) => {
      if (err) {
        console.error('Error inserting coordinator:', err);
        return res.status(500).json({
          success: false,
          message: 'Error adding coordinator'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Coordinator added successfully',
        coord_id: result.insertId
      });
    }
  );
});

/* PUT - Update result status */
router.put('/:festId/result-status', (req, res) => {
  const { festId } = req.params;
  const { result_status } = req.body;

  if (!result_status) {
    return res.status(400).json({
      success: false,
      message: 'Result status is required'
    });
  }

  const validStatuses = ['pending', 'processing', 'published'];
  if (!validStatuses.includes(result_status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid result status'
    });
  }

  const updateQuery = 'UPDATE tbl_fests SET result_status = ? WHERE fest_id = ?';

  db.query(updateQuery, [result_status, festId], (err, results) => {
    if (err) {
      console.error('Error updating result status:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating result status'
      });
    }

    res.json({
      success: true,
      message: 'Result status updated successfully'
    });
  });
});

/* PUT - Publish result */
router.put('/:festId/publish-result', (req, res) => {
  const { festId } = req.params;

  // Update fest result status to published
  const updateQuery = 'UPDATE tbl_fests SET result_status = ? WHERE fest_id = ?';

  db.query(updateQuery, ['published', festId], (err, results) => {
    if (err) {
      console.error('Error publishing result:', err);
      return res.status(500).json({
        success: false,
        message: 'Error publishing result'
      });
    }

    // TODO: Send notifications to all registered participants
    // This would involve fetching all participants registered in competitions of this fest
    // and sending them a notification message

    res.json({
      success: true,
      message: 'Result published successfully'
    });
  });
});

/* PUT - Update Fest */
router.put('/update/:id', (req, res) => {
  const festId = req.params.id;
  const { fest_name, fest_description, category_id, fest_for, startdate, enddate } = req.body;
  const festImage = req.files && req.files['fest_image'] ? req.files['fest_image'][0] : null;
  const brochureFile = req.files && req.files['brochure'] ? req.files['brochure'][0] : null;

  // Validation
  if (!fest_name || !fest_description || !category_id || !startdate || !enddate) {
    return res.status(400).json({ success: false, message: 'Fest name, description, category, and dates are required' });
  }

  // Get existing fest data to know old files
  db.query('SELECT * FROM tbl_fests WHERE fest_id = ?', [festId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Fest not found' });
    
    const fest = results[0];
    const imageToSave = festImage ? festImage.filename : fest.fest_image;
    const brochureToSave = brochureFile ? brochureFile.filename : fest.brochure;

    const updateQuery = `
      UPDATE tbl_fests 
      SET fest_name = ?, fest_description = ?, category_id = ?, fest_for = ?, startdate = ?, enddate = ?, fest_image = ?, brochure = ?
      WHERE fest_id = ?
    `;

    db.query(updateQuery, [
      fest_name.trim(), fest_description.trim(), category_id, fest_for, startdate, enddate, imageToSave, brochureToSave, festId
    ], (updateErr) => {
      if (updateErr) {
        console.error('Error updating fest:', updateErr);
        return res.status(500).json({ success: false, message: 'Error updating fest' });
      }

      res.json({ success: true, message: 'Fest updated successfully!' });
    });
  });
});

/* GET Guest details */
router.get('/guest/details/:festId', (req, res) => {
  const { festId } = req.params;
  const query = `
    SELECT 
      f.*, 
      i.institution_name, i.institution_email, i.institution_address, i.institution_contactno as institution_contact, 
      c.category_name, 
      (SELECT COUNT(*) FROM tbl_competitions comp WHERE comp.fest_id = f.fest_id) as event_count 
    FROM tbl_fests f 
    LEFT JOIN tbl_institution i ON f.institution_id = i.institution_id 
    LEFT JOIN tbl_category c ON f.category_id = c.category_id 
    WHERE f.fest_id = ?
  `;
  const db = require('../config/db');
  db.query(query, [festId], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (results.length === 0) return res.status(404).json({ success: false });
    res.json({ success: true, data: results[0] });
  });
});


router.get('/participation-report/:institutionId', (req, res) => {
  const institutionId = req.params.institutionId;
  const db = require('../config/db');

  const festQuery = `
    SELECT 
      f.fest_id,
      f.fest_name,
      COUNT(cr.competitionregid) as participant_count
    FROM tbl_fests f
    LEFT JOIN tbl_competitions c ON f.fest_id = c.fest_id
    LEFT JOIN tbl_competitionreg cr ON c.competition_id = cr.competitionid
    WHERE f.institution_id = ?
    GROUP BY f.fest_id, f.fest_name
  `;

  const compQuery = `
    SELECT 
      f.fest_name,
      c.competition_id,
      c.competition_name,
      COUNT(cr.competitionregid) as participant_count
    FROM tbl_competitions c
    JOIN tbl_fests f ON c.fest_id = f.fest_id
    LEFT JOIN tbl_competitionreg cr ON c.competition_id = cr.competitionid
    WHERE f.institution_id = ?
    GROUP BY c.competition_id, c.competition_name, f.fest_name
  `;

  db.query(festQuery, [institutionId], (err1, festResults) => {
    if (err1) return res.status(500).json({ success: false, message: 'DB Error' });
    
    db.query(compQuery, [institutionId], (err2, compResults) => {
      if (err2) return res.status(500).json({ success: false, message: 'DB Error' });
      
      res.json({
        success: true,
        festData: festResults,
        competitionData: compResults
      });
    });
  });
});


router.get('/prize-report/:institutionId', function(req, res, next) {
    const q = `
        SELECT 
            r.position, 
            c.competition_name, 
            f.fest_name, 
            p.participantname, 
            p.institution_name as participant_college
        FROM tbl_result r
        JOIN tbl_competitions c ON r.competition_id = c.competition_id
        JOIN tbl_fests f ON c.fest_id = f.fest_id
        JOIN tbl_competitionreg cr ON r.competition_reg_id = cr.competitionregid
        JOIN tbl_participant p ON cr.participantid = p.participantid
        WHERE f.institution_id = ?
        ORDER BY f.fest_name, c.competition_name, r.position ASC
    `;
    db.query(q, [req.params.institutionId], (err, results) => {
        if (err) return res.status(500).json({success: false, message: 'Database error', error: err});
        res.json({success: true, results: results});
    });
});

module.exports = router;

