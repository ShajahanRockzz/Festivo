const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* POST - Add coordinator to institution */
router.post('/', (req, res) => {
  const { name, email, contact_no, username, password, institution_id, login_id } = req.body;
  const image = req.file?.filename || '';

  // Validation
  if (!name || !email || !contact_no || !username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, contact number, username, and password are required'
    });
  }

  if (!institution_id) {
    return res.status(400).json({
      success: false,
      message: 'Institution ID is required'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(contact_no.replace(/\D/g, ''))) {
    return res.status(400).json({
      success: false,
      message: 'Phone number must be 10-15 digits'
    });
  }

  // Username validation
  if (username.length < 4) {
    return res.status(400).json({
      success: false,
      message: 'Username must be at least 4 characters'
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  // Check if username already exists in login table
  const checkUsernameQuery = 'SELECT login_id FROM tbl_login WHERE username = ?';
  db.query(checkUsernameQuery, [username.trim()], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).json({
        success: false,
        message: 'Error adding coordinator'
      });
    }

    if (results && results.length > 0) {
      console.log('Duplicate username detected:', username);
      return res.status(400).json({
        success: false,
        message: 'Username already exists. Please choose a different username'
      });
    }

    // Check if coordinator email already exists for this institution
    const checkCoordinatorQuery = 'SELECT coordinator_id FROM tbl_coordinators WHERE institution_id = ? AND email = ?';
    db.query(checkCoordinatorQuery, [institution_id, email.trim()], (err, coordinatorResults) => {
      if (err) {
        console.error('Error checking coordinator:', err);
        return res.status(500).json({
          success: false,
          message: 'Error adding coordinator'
        });
      }

      if (coordinatorResults && coordinatorResults.length > 0) {
        console.log('Duplicate coordinator detected - Email already exists:', email);
        return res.status(400).json({
          success: false,
          message: 'A coordinator with this email already exists in your institution'
        });
      }

      // Insert into tbl_login first to create login credentials
      const insertLoginQuery = 'INSERT INTO tbl_login (username, password, role, status) VALUES (?, ?, ?, ?)';
      db.query(insertLoginQuery, [username.trim(), password.trim(), 'Coordinator', 'active'], (err, loginResult) => {
        if (err) {
          console.error('Error inserting login:', err);
          return res.status(500).json({
            success: false,
            message: 'Error creating login credentials'
          });
        }

        const coordinatorLoginId = loginResult.insertId;
        console.log('Login created with ID:', coordinatorLoginId);

        // Now insert into tbl_coordinators with the new login_id
        const insertCoordinatorQuery = `
          INSERT INTO tbl_coordinators (name, email, contact_no, institution_id, image, login_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertCoordinatorQuery,
          [name.trim(), email.trim(), contact_no.trim(), institution_id, image, coordinatorLoginId],
          (err, coordinatorResult) => {
            if (err) {
              console.error('Error inserting coordinator:', err);
              // Rollback - Delete the login record if coordinator insert fails
              db.query('DELETE FROM tbl_login WHERE login_id = ?', [coordinatorLoginId], (deleteErr) => {
                if (deleteErr) {
                  console.error('Failed to rollback login record:', deleteErr);
                }
              });
              return res.status(500).json({
                success: false,
                message: 'Error adding coordinator'
              });
            }

            res.status(201).json({
              success: true,
              message: 'Coordinator added successfully',
              coordinator_id: coordinatorResult.insertId,
              data: {
                coordinator_id: coordinatorResult.insertId,
                name: name.trim(),
                email: email.trim(),
                contact_no: contact_no.trim(),
                institution_id: institution_id,
                image: image,
                login_id: coordinatorLoginId
              }
            });
          }
        );
      });
    });
  });
});

/* GET - Fetch all coordinators for a specific institution with status */
router.get('/institution/:institutionId', (req, res) => {
  const { institutionId } = req.params;

  const query = `
    SELECT 
      c.coordinator_id, 
      c.name, 
      c.email, 
      c.contact_no, 
      c.institution_id, 
      c.image, 
      c.login_id,
      l.status
    FROM tbl_coordinators c
    LEFT JOIN tbl_login l ON c.login_id = l.login_id
    WHERE c.institution_id = ? 
    ORDER BY c.coordinator_id DESC
  `;
  
  db.query(query, [institutionId], (err, results) => {
    if (err) {
      console.error('Error fetching coordinators:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching coordinators'
      });
    }

    res.json({
      success: true,
      count: results ? results.length : 0,
      data: results || []
    });
  });
});

/* GET - Fetch coordinator by ID */
router.get('/:coordinatorId', (req, res) => {
  const { coordinatorId } = req.params;

  const query = 'SELECT coordinator_id, name, email, contact_no, institution_id, image, login_id FROM tbl_coordinators WHERE coordinator_id = ?';
  
  db.query(query, [coordinatorId], (err, results) => {
    if (err) {
      console.error('Error fetching coordinator:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching coordinator'
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

/* PUT - Update coordinator */
router.put('/:coordinatorId', (req, res) => {
  const { coordinatorId } = req.params;
  const { name, email, contact_no } = req.body;
  const image = req.file?.filename;

  let updateFields = [];
  let updateValues = [];

  if (name !== undefined) {
    updateFields.push('name = ?');
    updateValues.push(name.trim());
  }
  if (email !== undefined) {
    updateFields.push('email = ?');
    updateValues.push(email.trim());
  }
  if (contact_no !== undefined) {
    updateFields.push('contact_no = ?');
    updateValues.push(contact_no.trim());
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

  // Validate email if being updated
  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
  }

  // Validate phone if being updated
  if (contact_no !== undefined) {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(contact_no.replace(/\D/g, ''))) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 10-15 digits'
      });
    }
  }

  updateValues.push(coordinatorId);
  const updateQuery = `UPDATE tbl_coordinators SET ${updateFields.join(', ')} WHERE coordinator_id = ?`;

  db.query(updateQuery, updateValues, (err, results) => {
    if (err) {
      console.error('Error updating coordinator:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating coordinator'
      });
    }

    res.json({
      success: true,
      message: 'Coordinator updated successfully'
    });
  });
});

/* DELETE - Remove coordinator */
router.delete('/:coordinatorId', (req, res) => {
  const { coordinatorId } = req.params;

  // First, get the login_id of the coordinator
  const getLoginQuery = 'SELECT login_id FROM tbl_coordinators WHERE coordinator_id = ?';
  db.query(getLoginQuery, [coordinatorId], (err, results) => {
    if (err) {
      console.error('Error fetching coordinator:', err);
      return res.status(500).json({
        success: false,
        message: 'Error removing coordinator'
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found'
      });
    }

    const loginId = results[0].login_id;

    // Delete from tbl_coordinators
    const deleteCoordinatorQuery = 'DELETE FROM tbl_coordinators WHERE coordinator_id = ?';
    db.query(deleteCoordinatorQuery, [coordinatorId], (err) => {
      if (err) {
        console.error('Error deleting coordinator:', err);
        return res.status(500).json({
          success: false,
          message: 'Error removing coordinator'
        });
      }

      // Delete from tbl_login
      const deleteLoginQuery = 'DELETE FROM tbl_login WHERE login_id = ?';
      db.query(deleteLoginQuery, [loginId], (err) => {
        if (err) {
          console.error('Error deleting login:', err);
          // Coordinator is already deleted, just inform about partial success
        }

        res.json({
          success: true,
          message: 'Coordinator removed successfully'
        });
      });
    });
  });
});

/* PUT - Update coordinator status (active/inactive) */
router.put('/:coordinatorId/status', (req, res) => {
  const { coordinatorId } = req.params;
  const { status } = req.body;

  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be "active" or "inactive"'
    });
  }

  // Get login_id first
  const getLoginQuery = 'SELECT login_id FROM tbl_coordinators WHERE coordinator_id = ?';
  db.query(getLoginQuery, [coordinatorId], (err, results) => {
    if (err) {
      console.error('Error fetching login_id:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating status'
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found'
      });
    }

    const loginId = results[0].login_id;

    // Update status in tbl_login
    const updateQuery = 'UPDATE tbl_login SET status = ? WHERE login_id = ?';
    db.query(updateQuery, [status, loginId], (err) => {
      if (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({
          success: false,
          message: 'Error updating coordinator status'
        });
      }

      res.json({
        success: true,
        message: `Coordinator status updated to ${status}`,
        status: status
      });
    });
  });
});

/* GET - Get coordinator_id by login_id */
router.get('/by-login/:loginId', (req, res) => {
  const { loginId } = req.params;

  if (!loginId) {
    return res.status(400).json({
      success: false,
      message: 'Login ID is required'
    });
  }

  const query = 'SELECT coordinator_id FROM tbl_coordinators WHERE login_id = ?';

  db.query(query, [loginId], (err, results) => {
    if (err) {
      console.error('Error fetching coordinator by login_id:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching coordinator'
      });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found'
      });
    }

    res.json({
      success: true,
      coordinator_id: results[0].coordinator_id
    });
  });
});

module.exports = router;


