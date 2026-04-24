const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/submit', (req, res) => {
    const { name, email, phone_no, subject, message } = req.body;

    if (!name || !email || !phone_no || !subject || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const query = `
        INSERT INTO tbl_guest_contact (name, email, phone_no, subject, message, status)
        VALUES (?, ?, ?, ?, ?, 'unreaded')
    `;

    db.query(query, [name, email, phone_no, subject, message], (err, results) => {
        if (err) {
            console.error('Error inserting contact message:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Contact message saved successfully.', id: results.insertId });
    });
});

// Admin Route: Get all contact messages
router.get('/messages', (req, res) => {
    const query = `SELECT * FROM tbl_guest_contact ORDER BY contact_id DESC`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching contact messages:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, messages: results });
    });
});

// Admin Route: Mark a message as readed
router.put('/messages/:id/read', (req, res) => {
    const contactId = req.params.id;
    const query = `UPDATE tbl_guest_contact SET status = 'readed' WHERE contact_id = ?`;
    
    db.query(query, [contactId], (err, results) => {
        if (err) {
            console.error('Error updating contact message status:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, message: 'Message marked as readed' });
    });
});

// Admin Route: Delete a message
router.delete('/messages/:id', (req, res) => {
    const contactId = req.params.id;
    const query = `DELETE FROM tbl_guest_contact WHERE contact_id = ?`;
    
    db.query(query, [contactId], (err, results) => {
        if (err) {
            console.error('Error deleting contact message:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }
        res.status(200).json({ success: true, message: 'Message deleted successfully' });
    });
});

module.exports = router;
