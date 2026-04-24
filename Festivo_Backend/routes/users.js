var express = require('express');
var router = express.Router();
var db = require('../config/db');

// Get all institutions with status from tbl_login
router.get('/institutions', function (req, res) {
  try {
    const query = `
      SELECT 
        i.institution_id,
        i.institution_name,
        i.institution_email,
        i.institution_address,
        i.institution_contactno,
        i.institution_image,
        i.websiteaddress,
        i.login_id,
        l.status
      FROM tbl_institution i
      JOIN tbl_login l ON i.login_id = l.login_id
      ORDER BY i.institution_id DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching institutions:', err);
        res.json({ success: false, message: 'Error fetching institutions' });
      } else {
        res.json({ success: true, data: results });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});


// Get all coordinators with status from tbl_login
router.get('/coordinators', function (req, res) {
  try {
    const query = `
      SELECT 
        c.coordinator_id,
        c.name,
        c.email,
        c.contact_no,
        c.institution_id,
        i.institution_name,
        c.image,
        c.login_id,
        l.status
      FROM tbl_coordinators c
      JOIN tbl_institution i ON c.institution_id = i.institution_id
      JOIN tbl_login l ON c.login_id = l.login_id
      ORDER BY c.coordinator_id DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching coordinators:', err);
        res.json({ success: false, message: 'Error fetching coordinators' });
      } else {
        res.json({ success: true, data: results });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Get all participants with status from tbl_login
router.get('/participants', function (req, res) {
  try {
    const query = `
      SELECT 
        p.participantid,
        p.participantname,
        p.participantemail,
        p.contact_no,
        p.academic_status,
        p.institution_name,
        p.participantimage,
        p.loginid,
        l.status
      FROM tbl_participant p
      JOIN tbl_login l ON p.loginid = l.login_id
      ORDER BY p.participantid DESC
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching participants:', err);
        res.json({ success: false, message: 'Error fetching participants' });
      } else {
        res.json({ success: true, data: results });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Update institution status (and deactivate coordinators if institution is deactivated)
router.post('/update-institution-status', function (req, res) {
  try {
    const { institution_id, status } = req.body;

    if (!institution_id || !status) {
      res.json({ success: false, message: 'Institution ID and status are required' });
      return;
    }

    // Get the login_id for the institution
    const getLoginIdQuery = `SELECT login_id FROM tbl_institution WHERE institution_id = ?`;

    db.query(getLoginIdQuery, [institution_id], (err, results) => {
      if (err || !results || results.length === 0) {
        res.json({ success: false, message: 'Institution not found' });
        return;
      }

      const login_id = results[0].login_id;

      // Update the login status for the institution
      const updateInstitutionQuery = `UPDATE tbl_login SET status = ? WHERE login_id = ?`;

      db.query(updateInstitutionQuery, [status, login_id], (err) => {
        if (err) {
          console.error('Error updating institution status:', err);
          res.json({ success: false, message: 'Error updating institution status' });
          return;
        }

        // If deactivating institution, also deactivate all its coordinators
        if (status === 'inactive') {
          const deactivateCoordinatorsQuery = `
            UPDATE tbl_login 
            SET status = 'inactive' 
            WHERE login_id IN (
              SELECT login_id FROM tbl_coordinators WHERE institution_id = ?
            )
          `;

          db.query(deactivateCoordinatorsQuery, [institution_id], (err) => {
            if (err) {
              console.error('Error deactivating coordinators:', err);
              res.json({ success: false, message: 'Error updating institution status' });
              return;
            }
            res.json({ success: true, message: 'Institution status updated successfully' });
          });
        } else {
          res.json({ success: true, message: 'Institution status updated successfully' });
        }
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Update coordinator status
router.post('/update-coordinator-status', function (req, res) {
  try {
    const { coordinator_id, status } = req.body;

    if (!coordinator_id || !status) {
      res.json({ success: false, message: 'Coordinator ID and status are required' });
      return;
    }

    // Get the login_id for the coordinator
    const getLoginIdQuery = `SELECT login_id FROM tbl_coordinators WHERE coordinator_id = ?`;

    db.query(getLoginIdQuery, [coordinator_id], (err, results) => {
      if (err || !results || results.length === 0) {
        res.json({ success: false, message: 'Coordinator not found' });
        return;
      }

      const login_id = results[0].login_id;

      // Update the login status for the coordinator
      const updateCoordinatorQuery = `UPDATE tbl_login SET status = ? WHERE login_id = ?`;

      db.query(updateCoordinatorQuery, [status, login_id], (err) => {
        if (err) {
          console.error('Error updating coordinator status:', err);
          res.json({ success: false, message: 'Error updating coordinator status' });
          return;
        }
        res.json({ success: true, message: 'Coordinator status updated successfully' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Update participant status
router.post('/update-participant-status', function (req, res) {
  try {
    const { participant_id, status } = req.body;

    if (!participant_id || !status) {
      res.json({ success: false, message: 'Participant ID and status are required' });
      return;
    }

    // Get the login_id for the participant
    const getLoginIdQuery = `SELECT loginid FROM tbl_participant WHERE participantid = ?`;

    db.query(getLoginIdQuery, [participant_id], (err, results) => {
      if (err || !results || results.length === 0) {
        res.json({ success: false, message: 'Participant not found' });
        return;
      }

      const login_id = results[0].loginid;

      // Update the login status for the participant
      const updateParticipantQuery = `UPDATE tbl_login SET status = ? WHERE login_id = ?`;

      db.query(updateParticipantQuery, [status, login_id], (err) => {
        if (err) {
          console.error('Error updating participant status:', err);
          res.json({ success: false, message: 'Error updating participant status' });
          return;
        }
        res.json({ success: true, message: 'Participant status updated successfully' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// Get a specific institution by ID
router.get('/:institutionId', function (req, res) {
  try {
    const { institutionId } = req.params;

    const query = `
      SELECT 
        i.institution_id,
        i.institution_name,
        i.institution_email,
        i.institution_address,
        i.institution_contactno,
        i.institution_image,
        i.websiteaddress,
        i.latitude,
        i.longitude,
        i.google_maps_link,
        i.login_id,
        l.status
      FROM tbl_institution i
      JOIN tbl_login l ON i.login_id = l.login_id
      WHERE i.institution_id = ?
    `;

    db.query(query, [institutionId], (err, results) => {
      if (err) {
        console.error('Error fetching institution:', err);
        return res.status(500).json({ success: false, message: 'Error fetching institution' });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ success: false, message: 'Institution not found' });
      }

      res.json({ success: true, data: results[0] });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
