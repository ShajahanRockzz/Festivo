const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET - Fetch all participants for a competition */
router.get('/competition/:competitionId', (req, res) => {
  const { competitionId } = req.params;

  const query = `
    SELECT 
      cr.competitionregid,
      cr.competitionid,
      cr.chessno,
      cr.attendance,
      cr.regdate,
      p.participantid,
      p.participantname,
      p.participantemail,
      p.contact_no
    FROM tbl_competitionreg cr
    INNER JOIN tbl_participant p ON cr.participantid = p.participantid
    WHERE cr.competitionid = ?
    ORDER BY p.participantname ASC
  `;

  db.query(query, [competitionId], (err, results) => {
    if (err) {
      console.error('Error fetching participants:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching participants'
      });
    }

    res.json(results || []);
  });
});

/* PUT - Update chess number */
router.put('/chess-no/:regId', (req, res) => {
  const { regId } = req.params;
  const { chessno } = req.body;

  if (!chessno) {
    return res.status(400).json({
      success: false,
      message: 'Chess number is required'
    });
  }

  const query = 'UPDATE tbl_competitionreg SET chessno = ? WHERE competitionregid = ?';

  db.query(query, [chessno, regId], (err, results) => {
    if (err) {
      console.error('Error updating chess number:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating chess number'
      });
    }

    res.json({
      success: true,
      message: 'Chess number updated successfully'
    });
  });
});

/* PUT - Update attendance */
router.put('/attendance/:regId', (req, res) => {
  const { regId } = req.params;
  const { attendance } = req.body;

  if (!attendance) {
    return res.status(400).json({
      success: false,
      message: 'Attendance status is required'
    });
  }

  const query = 'UPDATE tbl_competitionreg SET attendance = ? WHERE competitionregid = ?';

  db.query(query, [attendance, regId], (err, results) => {
    if (err) {
      console.error('Error updating attendance:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating attendance'
      });
    }

    res.json({
      success: true,
      message: 'Attendance updated successfully'
    });
  });
});

/* GET - Check if result exists for a participant */
router.get('/result/:competitionRegId', (req, res) => {
  const { competitionRegId } = req.params;

  const query = 'SELECT * FROM tbl_result WHERE competition_reg_id = ?';

  db.query(query, [competitionRegId], (err, results) => {
    if (err) {
      console.error('Error fetching result:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching result'
      });
    }

    res.json(results && results.length > 0 ? results[0] : null);
  });
});

/* POST - Save or update result */
router.post('/result', (req, res) => {
  const { competition_id, competition_reg_id, position } = req.body;

  if (!competition_reg_id || !position) {
    return res.status(400).json({
      success: false,
      message: 'Competition registration ID and position are required'
    });
  }

  // First check if result already exists
  const checkQuery = 'SELECT * FROM tbl_result WHERE competition_reg_id = ?';

  db.query(checkQuery, [competition_reg_id], (err, results) => {
    if (err) {
      console.error('Error checking result:', err);
      return res.status(500).json({
        success: false,
        message: 'Error saving result'
      });
    }

    if (results && results.length > 0) {
      // Update existing result
      const updateQuery = 'UPDATE tbl_result SET position = ? WHERE competition_reg_id = ?';

      db.query(updateQuery, [position, competition_reg_id], (err, updateResults) => {
        if (err) {
          console.error('Error updating result:', err);
          return res.status(500).json({
            success: false,
            message: 'Error updating result'
          });
        }

        res.json({
          success: true,
          message: 'Result updated successfully',
          result_id: results[0].result_id
        });
      });
    } else {
      // Insert new result
      const insertQuery = 'INSERT INTO tbl_result (competition_id, competition_reg_id, position) VALUES (?, ?, ?)';

      db.query(insertQuery, [competition_id, competition_reg_id, position], (err, insertResults) => {
        if (err) {
          console.error('Error inserting result:', err);
          return res.status(500).json({
            success: false,
            message: 'Error saving result'
          });
        }

        res.json({
          success: true,
          message: 'Result saved successfully',
          result_id: insertResults.insertId
        });
      });
    }
  });
});

/* DELETE - Delete a result */
router.delete('/result/:resultId', (req, res) => {
  const { resultId } = req.params;

  const query = 'DELETE FROM tbl_result WHERE result_id = ?';

  db.query(query, [resultId], (err, results) => {
    if (err) {
      console.error('Error deleting result:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting result'
      });
    }

    res.json({
      success: true,
      message: 'Result deleted successfully'
    });
  });
});


/* GET - Fetch all competitions registered by a specific participant */
router.get('/my-registrations/:participantId', (req, res) => {
  const { participantId } = req.params;

  const query = `
    SELECT
      cr.competitionregid,
      cr.chessno,
      cr.attendance,
      cr.regdate,
      c.competition_id as competitionid, c.competition_name,
      c.competition_date,
      c.type,
      c.image,
      c.fest_id,
      f.fest_name,
      i.institution_name,
      r.position,
      c.res_status
    FROM tbl_competitionreg cr
    INNER JOIN tbl_competitions c ON cr.competitionid = c.competition_id
    INNER JOIN tbl_fests f ON c.fest_id = f.fest_id
    LEFT JOIN tbl_institution i ON f.institution_id = i.institution_id
    LEFT JOIN tbl_result r ON r.competition_reg_id = cr.competitionregid
    WHERE cr.participantid = ?
    ORDER BY cr.regdate DESC
  `;

  db.query(query, [participantId], (err, results) => {
    if (err) {
      console.error('Error fetching participant registrations:', err);
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

/* GET - Fetch all competitions registered by a specific participant */
router.get('/my-registrations/:participantId', (req, res) => {
  const { participantId } = req.params;

  const query = `
    SELECT
      cr.competitionregid,
      cr.attendance,
      cr.regdate,
      c.competition_id as competitionid, c.competition_name,
      c.competition_date,
      c.type,
      c.image,
      c.fest_id,
      f.fest_name,
      i.institution_name,
      r.position,
      c.res_status
    FROM tbl_competitionreg cr
    INNER JOIN tbl_competitions c ON cr.competitionid = c.competition_id
    INNER JOIN tbl_fests f ON c.fest_id = f.fest_id
    LEFT JOIN tbl_institution i ON f.institution_id = i.institution_id
    LEFT JOIN tbl_result r ON r.competition_reg_id = cr.competitionregid
    WHERE cr.participantid = ?
    ORDER BY cr.regdate DESC
  `;

  db.query(query, [participantId], (err, results) => {
    if (err) {
      console.error('Error fetching participant registrations:', err);
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



/* GET - Fetch specific registration details */
router.get('/registration/:regId', (req, res) => {
  const { regId } = req.params;
  const query = "    SELECT      cr.competitionregid as reg_id,      cr.chessno, cr.attendance,      cr.regdate,      c.competition_id as competitionid, c.competition_name,      c.competition_date,      c.type,      c.image as fest_image,       c.description as rules,      f.fest_name,      i.institution_name,      r.position,      c.res_status    FROM tbl_competitionreg cr    INNER JOIN tbl_competitions c ON cr.competitionid = c.competition_id    INNER JOIN tbl_fests f ON c.fest_id = f.fest_id    LEFT JOIN tbl_institution i ON f.institution_id = i.institution_id    LEFT JOIN tbl_result r ON r.competition_reg_id = cr.competitionregid    WHERE cr.competitionregid = ?  ";
  db.query(query, [regId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database Error' });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Registration not found' });
    const regData = results[0];
    if (regData.type === 'group') {
      const groupQuery = "SELECT detailid, participantname, email, contact_no, collegeidproof FROM tbl_competition_group_details WHERE competitionregid = ?";
      db.query(groupQuery, [regId], (gErr, gResults) => {
        if (gErr) return res.status(500).json({ success: false, message: 'Error fetching group details' });
        regData.group_members = gResults;
        return res.json({ success: true, data: regData });
      });
    } else {
      res.json({ success: true, data: regData });
    }
  });
});

module.exports = router;
