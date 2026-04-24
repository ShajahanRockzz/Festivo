const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* POST - Add New Subscription Plan */
router.post('/add', (req, res) => {
  const { plan_name, description, days, amount } = req.body;

  // Validation
  if (!plan_name || !description || !days || !amount) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Validate plan name length
  if (plan_name.trim().length < 3 || plan_name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Plan name must be between 3 and 100 characters'
    });
  }

  // Validate description length
  if (description.trim().length < 10 || description.trim().length > 500) {
    return res.status(400).json({
      success: false,
      message: 'Description must be between 10 and 500 characters'
    });
  }

  // Validate days
  if (isNaN(days) || days <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Days must be greater than 0'
    });
  }

  // Check if plan already exists
  const checkQuery = 'SELECT * FROM tbl_plan WHERE plan_name = ?';
  db.query(checkQuery, [plan_name.trim()], (err, results) => {
    if (err) {
      console.error('Database error while checking plan:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Subscription plan already exists'
      });
    }

    // Insert new plan
    const insertQuery = `
      INSERT INTO tbl_plan (plan_name, days, amount, description)
      VALUES (?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [plan_name.trim(), days, amount.trim(), description.trim()],
      (err, results) => {
        if (err) {
          console.error('Error inserting plan:', err);
          return res.status(500).json({
            success: false,
            message: 'Error creating subscription plan'
          });
        }

        res.status(201).json({
          success: true,
          message: 'Subscription plan created successfully',
          planId: results.insertId,
          data: {
            plan_id: results.insertId,
            plan_name: plan_name.trim(),
            days: days,
            amount: amount.trim(),
            description: description.trim()
          }
        });
      }
    );
  });
});

/* GET - Get All Subscription Plans */
router.get('/all', (req, res) => {
  const query = 'SELECT * FROM tbl_plan ORDER BY plan_id DESC';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    res.json({
      success: true,
      data: results || [],
      count: results.length
    });
  });
});

/* GET - Get Single Subscription Plan */
router.get('/:planId', (req, res) => {
  const { planId } = req.params;

  // Validate planId
  if (!planId || isNaN(planId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid plan ID'
    });
  }

  const query = 'SELECT * FROM tbl_plan WHERE plan_id = ?';
  db.query(query, [planId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

/* PUT - Update Subscription Plan */
router.put('/update/:planId', (req, res) => {
  const { planId } = req.params;
  const { plan_name, description, days, amount } = req.body;

  // Validate planId
  if (!planId || isNaN(planId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid plan ID'
    });
  }

  // Validation
  if (!plan_name || !description || !days || !amount) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  // Validate plan name length
  if (plan_name.trim().length < 3 || plan_name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Plan name must be between 3 and 100 characters'
    });
  }

  // Check if plan exists
  const checkQuery = 'SELECT * FROM tbl_plan WHERE plan_id = ?';
  db.query(checkQuery, [planId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Update plan
    const updateQuery = `
      UPDATE tbl_plan 
      SET plan_name = ?, days = ?, amount = ?, description = ?
      WHERE plan_id = ?
    `;

    db.query(
      updateQuery,
      [plan_name.trim(), days, amount.trim(), description.trim(), planId],
      (err, results) => {
        if (err) {
          console.error('Error updating plan:', err);
          return res.status(500).json({
            success: false,
            message: 'Error updating subscription plan'
          });
        }

        res.json({
          success: true,
          message: 'Subscription plan updated successfully',
          data: {
            plan_id: planId,
            plan_name: plan_name.trim(),
            days: days,
            amount: amount.trim(),
            description: description.trim()
          }
        });
      }
    );
  });
});

/* DELETE - Delete Subscription Plan */
router.delete('/delete/:planId', (req, res) => {
  const { planId } = req.params;

  // Validate planId
  if (!planId || isNaN(planId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid plan ID'
    });
  }

  // Check if plan exists
  const checkQuery = 'SELECT * FROM tbl_plan WHERE plan_id = ?';
  db.query(checkQuery, [planId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found'
      });
    }

    // Delete plan
    const deleteQuery = 'DELETE FROM tbl_plan WHERE plan_id = ?';
    db.query(deleteQuery, [planId], (err, results) => {
      if (err) {
        console.error('Error deleting plan:', err);
        return res.status(500).json({
          success: false,
          message: 'Error deleting subscription plan'
        });
      }

      res.json({
        success: true,
        message: 'Subscription plan deleted successfully'
      });
    });
  });
});

module.exports = router;
