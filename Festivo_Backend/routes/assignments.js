const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET - Fetch all assignments for a coordinator */
router.get('/coordinator/:coordinatorId', (req, res) => {
  const { coordinatorId } = req.params;

  if (!coordinatorId || coordinatorId === 'undefined') {
    return res.status(400).json([]);
  }

  const query = `
    SELECT 
      a.assgin_id,
      a.competition_id,
      a.coordinator_id,
      cp.competition_name,
      cp.fest_id,
      f.fest_name
    FROM tbl_assign a
    LEFT JOIN tbl_competitions cp ON a.competition_id = cp.competition_id
    LEFT JOIN tbl_fests f ON cp.fest_id = f.fest_id
    WHERE a.coordinator_id = ?
    ORDER BY f.fest_id DESC, cp.competition_name ASC
  `;

  db.query(query, [coordinatorId], (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.json([]);
    }

    res.json(results || []);
  });
});

/* GET - Fetch assignments for a specific fest */
router.get('/fest/:festId/coordinator/:coordinatorId', (req, res) => {
  const { festId, coordinatorId } = req.params;

  const query = `
    SELECT 
      a.assgin_id,
      a.competition_id,
      a.coordinator_id,
      cp.competition_name,
      cp.fest_id
    FROM tbl_assign a
    LEFT JOIN tbl_competitions cp ON a.competition_id = cp.competition_id
    LEFT JOIN tbl_fests f ON cp.fest_id = f.fest_id
    WHERE a.coordinator_id = ? AND cp.fest_id = ?
    ORDER BY cp.competition_name ASC
  `;

  db.query(query, [coordinatorId, festId], (err, results) => {
    if (err) {
      console.error('Error fetching assignments:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching assignments'
      });
    }

    res.json(results || []);
  });
});

/* GET - Fetch assignments for a specific fest (all coordinators) */
router.get('/fest/:festId', (req, res) => {
  const { festId } = req.params;

  const query = `
    SELECT
      a.assgin_id,
      a.competition_id,
      a.coordinator_id,
      cp.competition_name,
      cp.fest_id,
      c.name AS coordinator_name
    FROM tbl_assign a
    LEFT JOIN tbl_competitions cp ON a.competition_id = cp.competition_id
    LEFT JOIN tbl_coordinators c ON a.coordinator_id = c.coordinator_id
    WHERE cp.fest_id = ?
    ORDER BY cp.competition_name ASC, c.name ASC
  `;

  db.query(query, [festId], (err, results) => {
    if (err) {
      console.error('Error fetching fest assignments:', err);
      return res.status(500).json({
        success: false,
        message: 'Error fetching assignments'
      });
    }

    res.json({
      success: true,
      data: results || []
    });
  });
});

/* POST - Assign coordinator to competition */
router.post('/', (req, res) => {
  const { competition_id, coordinator_id } = req.body;

  if (!competition_id || !coordinator_id) {
    return res.status(400).json({
      success: false,
      message: 'competition_id and coordinator_id are required'
    });
  }

  const query = 'INSERT INTO tbl_assign (competition_id, coordinator_id) VALUES (?, ?)';

  db.query(query, [competition_id, coordinator_id], (err, results) => {
    if (err) {
      console.error('Error assigning coordinator:', err);
      return res.status(500).json({
        success: false,
        message: 'Error assigning coordinator to competition'
      });
    }

    res.json({
      success: true,
      message: 'Coordinator assigned successfully',
      assgin_id: results.insertId
    });
  });
});

/* DELETE - Remove assignment */
router.delete('/:assignId', (req, res) => {
  const { assignId } = req.params;

  const query = 'DELETE FROM tbl_assign WHERE assgin_id = ?';

  db.query(query, [assignId], (err, results) => {
    if (err) {
      console.error('Error deleting assignment:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting assignment'
      });
    }

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  });
});

module.exports = router;
