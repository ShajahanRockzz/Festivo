const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

/* POST - User Login */
router.post('/authenticate', (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  // Query the login table
  const query = 'SELECT * FROM tbl_login WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const user = results[0];

    // Check if account is active
    if (user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Account is inactive. Please contact administrator.' });
    }

    // Verify password - handle both plain text and bcrypt hashed passwords
    const isHashedPassword = user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$');

    if (isHashedPassword) {
      // Use bcrypt for hashed passwords
      bcrypt.compare(password, user.password, (err, isPasswordValid) => {
        if (err) {
          console.error('Password comparison error:', err);
          return res.status(500).json({ success: false, message: 'Error processing login' });
        }

        if (!isPasswordValid) {
          return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Query for additional details based on role
        let userResponse = {
          loginId: user.login_id,
          username: user.username,
          role: user.role,
          status: user.status
        };

        const roleLower = user.role.toLowerCase();
        
        if (roleLower === 'institution') {
          const institutionQuery = 'SELECT institution_id FROM tbl_institution WHERE login_id = ?';
          db.query(institutionQuery, [user.login_id], (err, institutionResults) => {
            if (!err && institutionResults.length > 0) {
              userResponse.institutionId = institutionResults[0].institution_id;
            }
            res.status(200).json({ success: true, message: 'Login successful', user: userResponse });
          });
        } else if (roleLower === 'participant') {
          const participantQuery = 'SELECT participantid, participantname, participantemail, contact_no FROM tbl_participant WHERE loginid = ?';
          db.query(participantQuery, [user.login_id], (err, pResults) => {
            if (!err && pResults.length > 0) {
              userResponse.participantid = pResults[0].participantid;
              userResponse.participantname = pResults[0].participantname;
              userResponse.participantemail = pResults[0].participantemail;
              userResponse.contact_no = pResults[0].contact_no;
            }
            res.status(200).json({ success: true, message: 'Login successful', user: userResponse });
          });
        } else if (roleLower === 'coordinator') {
          const coordQuery = 'SELECT coordinator_id, name as coordinator_name FROM tbl_coordinators WHERE login_id = ?';
          db.query(coordQuery, [user.login_id], (err, cResults) => {
            if (!err && cResults.length > 0) {
              userResponse.coordinator_id = cResults[0].coordinator_id;
              userResponse.name = cResults[0].coordinator_name;
            }
            res.status(200).json({ success: true, message: 'Login successful', user: userResponse });
          });
        } else {
          // Admin or other roles
          res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse
          });
        }
      });
    } else {
      // Plain text password comparison
      const isPasswordValid = password === user.password;

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
      }

        let userResponse = {
          loginId: user.login_id,
          username: user.username,
          role: user.role,
          status: user.status
        };

        const roleLower = user.role.toLowerCase();
        
        if (roleLower === 'institution') {
          const institutionQuery = 'SELECT institution_id FROM tbl_institution WHERE login_id = ?';
          db.query(institutionQuery, [user.login_id], (err, institutionResults) => {
            if (!err && institutionResults.length > 0) {
              userResponse.institutionId = institutionResults[0].institution_id;
            }
            res.status(200).json({ success: true, message: 'Login successful', user: userResponse });
          });
        } else if (roleLower === 'participant') {
          const participantQuery = 'SELECT participantid, participantname, participantemail, contact_no FROM tbl_participant WHERE loginid = ?';
          db.query(participantQuery, [user.login_id], (err, pResults) => {
            if (!err && pResults.length > 0) {
              userResponse.participantid = pResults[0].participantid;
              userResponse.participantname = pResults[0].participantname;
              userResponse.participantemail = pResults[0].participantemail;
              userResponse.contact_no = pResults[0].contact_no;
            }
            res.status(200).json({ success: true, message: 'Login successful', user: userResponse });
          });
        } else if (roleLower === 'coordinator') {
          const coordQuery = 'SELECT coordinator_id, name as coordinator_name FROM tbl_coordinators WHERE login_id = ?';
          db.query(coordQuery, [user.login_id], (err, cResults) => {
            if (!err && cResults.length > 0) {
              userResponse.coordinator_id = cResults[0].coordinator_id;
              userResponse.name = cResults[0].coordinator_name;
            }
            res.status(200).json({ success: true, message: 'Login successful', user: userResponse });
          });
        } else {
          // Admin or other roles
          res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse
          });
        }
    }
  });
});

/* GET - Get user details by role and login id */
router.get('/user-details/:loginId/:role', (req, res) => {
  const { loginId, role } = req.params;

  if (!loginId || !role) {
    return res.status(400).json({ success: false, message: 'Login ID and role are required' });
  }

  let query = '';
  let table = '';

  // Determine which table to query based on role
  switch (role.toLowerCase()) {
    case 'admin':
      table = 'tbl_admin';
      query = `SELECT * FROM ${table} WHERE login_id = ?`;
      break;
    case 'institution':
      table = 'tbl_institution';
      query = `SELECT * FROM ${table} WHERE login_id = ?`;
      break;
    case 'participant':
      table = 'tbl_participant';
      query = `SELECT * FROM ${table} WHERE login_id = ?`;
      break;
    case 'coordinator':
      table = 'tbl_coordinators';
      query = `SELECT * FROM ${table} WHERE login_id = ?`;
      break;
    default:
      return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  db.query(query, [loginId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User details not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User details retrieved',
      userDetails: results[0]
    });
  });
});

module.exports = router;
