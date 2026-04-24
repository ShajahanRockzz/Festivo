const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

/* POST - Register Participant */
router.post('/register-participant', (req, res) => {
  const {
    participantname,
    participantemail,
    contact_no,
    academic_status,
    institution_name,
    username,
    password,
    role
  } = req.body;

  // Log incoming data for debugging
  console.log('Registration request received:', {
    participantname,
    participantemail,
    contact_no,
    academic_status,
    institution_name,
    username,
    password,
    role,
    hasFiles: req.files ? Object.keys(req.files) : []
  });

  // Validation
  if (!participantname || !participantemail || !contact_no || !academic_status || !username || !password) {
    console.log('Validation failed - missing required fields');
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Institution name required only for students
  const isStudent = academic_status === 'School Student' || academic_status === 'College Student';
  if (isStudent && !institution_name) {
    console.log('Student selected but no institution name provided');
    return res.status(400).json({ success: false, message: 'Institution name is required for students' });
  }

  // Check if username already exists in login table
  const checkUserQuery = 'SELECT * FROM tbl_login WHERE username = ?';
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error('Database error checking username:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      console.log('Username already exists:', username);
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Insert into tbl_login with plain text password
    const insertLoginQuery = 'INSERT INTO tbl_login (username, password, role, status) VALUES (?, ?, ?, ?)';
    db.query(insertLoginQuery, [username, password, role, 'active'], (err, loginResult) => {
        if (err) {
          console.error('Login insert error:', err);
          return res.status(500).json({ success: false, message: 'Error creating login: ' + err.message });
        }

        const loginId = loginResult.insertId;
        console.log('Login created with ID:', loginId);

        // Handle file uploads
        let idProofPath = '';
        let profileImagePath = '';

        // Check ID proof (required for students)
        if (isStudent && (!req.files || !req.files.institution_id_proof)) {
          console.log('File upload required for student but not provided');
          return res.status(400).json({ success: false, message: 'ID proof is required for students' });
        }
        
        // Check profile image (required for all)
        if (!req.files || !req.files.participantimage) {
          console.log('Profile image upload required but not provided');
          return res.status(400).json({ success: false, message: 'Profile photo is required' });
        }

        // Get ID proof filename if provided
        if (req.files && req.files.institution_id_proof) {
          idProofPath = req.files.institution_id_proof[0].filename;
          console.log('ID proof uploaded:', idProofPath);
        }

        // Get profile image filename
        if (req.files && req.files.participantimage) {
          profileImagePath = req.files.participantimage[0].filename;
          console.log('Profile image uploaded:', profileImagePath);
        }

        // Insert into tbl_participant
        const insertParticipantQuery = 'INSERT INTO tbl_participant (participantname, participantemail, contact_no, academic_status, institution_name, institution_id_proof, participantimage, loginid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(insertParticipantQuery, [participantname, participantemail, contact_no, academic_status, institution_name || null, idProofPath || null, profileImagePath || null, loginId], (err, participantResult) => {
          if (err) {
            console.error('Participant insert error:', err);
            // Delete the login record if participant insert fails (rollback)
            db.query('DELETE FROM tbl_login WHERE loginid = ?', [loginId], (deleteErr) => {
              if (deleteErr) {
                console.error('Failed to rollback login record:', deleteErr);
              } else {
                console.log('Rolled back login record due to participant insert failure');
              }
              return res.status(500).json({ success: false, message: 'Error creating participant profile: ' + err.message });
            });
          } else {
            console.log('Participant registered successfully with ID:', participantResult.insertId);
            res.status(201).json({
              success: true,
              message: 'Participant registered successfully',
              participantId: participantResult.insertId,
              loginId: loginId
            });
          }
        });
    });
  });
});

/* GET - Check username availability */
router.get('/check-username/:username', (req, res) => {
  const { username } = req.params;

  const checkQuery = 'SELECT * FROM tbl_login WHERE username = ?';
  db.query(checkQuery, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(200).json({ available: false });
    }

    res.status(200).json({ available: true });
  });
});

/* GET - Check email availability */
router.get('/check-email/:email', (req, res) => {
  const { email } = req.params;

  const checkQuery = 'SELECT * FROM tbl_participant WHERE participantemail = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(200).json({ available: false });
    }

    res.status(200).json({ available: true });
  });
});

module.exports = router;
