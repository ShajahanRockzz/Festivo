const express = require('express');
const router = express.Router();
const db = require('../config/db');
const https = require('https');

// Location cache to reduce API calls
const locationCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/* POST - Register Institution */
router.post('/register-institution', (req, res) => {
  const {
    institution_name,
    institution_address,
    institution_email,
    institution_contactno,
    websiteaddress,
    username,
    password,
    role,
    latitude,
    longitude,
    google_maps_link
  } = req.body;

  // Validation - websiteaddress and institution_image are now optional
  if (!institution_name || !institution_address || !institution_email || !institution_contactno || !username || !password || !latitude || !longitude || !google_maps_link) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided' });
  }

  // Check if username already exists in login table
  const checkUserQuery = 'SELECT * FROM tbl_login WHERE username = ?';
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Insert into tbl_login with plain text password
    const insertLoginQuery = 'INSERT INTO tbl_login (username, password, role, status) VALUES (?, ?, ?, ?)';
    db.query(insertLoginQuery, [username, password, role, 'active'], (err, loginResult) => {
      if (err) {
        console.error('Login insert error:', err);
        return res.status(500).json({ success: false, message: 'Error creating login' });
      }

      const loginId = loginResult.insertId;

      // Handle file upload
      let logoPath = '';
      if (req.file) {
        logoPath = req.file.filename;
      }

      // Insert into tbl_institution
      const insertInstitutionQuery = 'INSERT INTO tbl_institution (institution_name, institution_address, institution_email, institution_contactno, institution_image, websiteaddress, latitude, longitude, google_maps_link, login_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(insertInstitutionQuery, [institution_name, institution_address, institution_email, institution_contactno, logoPath, websiteaddress, latitude, longitude, google_maps_link, loginId], (err, institutionResult) => {
        if (err) {
          console.error('Institution insert error:', err);
          // Rollback - Delete the login record if institution insert fails
          db.query('DELETE FROM tbl_login WHERE login_id = ?', [loginId], (deleteErr) => {
            if (deleteErr) {
              console.error('Failed to rollback login record:', deleteErr);
            } else {
              console.log('Rolled back login record due to institution insert failure');
            }
            return res.status(500).json({ success: false, message: 'Error creating institution profile: ' + err.message });
          });
          return;
        }

        res.status(201).json({
          success: true,
          message: 'Institution registered successfully',
          institutionId: institutionResult.insertId,
          loginId: loginId
        });
      });
    });
  });
});

/* GET - Check institution email availability */
router.get('/check-email/:email', (req, res) => {
  const { email } = req.params;

  const checkQuery = 'SELECT * FROM tbl_institution WHERE institution_email = ?';
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

/* GET - Search locations using Nominatim API with caching */
router.get('/search-location', (req, res) => {
  const { query } = req.query;

  if (!query || !query.trim()) {
    return res.status(400).json({ success: false, message: 'Search query is required' });
  }

  const normalizedQuery = query.trim().toLowerCase();

  // Check cache first
  if (locationCache.has(normalizedQuery)) {
    const cached = locationCache.get(normalizedQuery);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Cache hit for: ${normalizedQuery}`);
      return res.status(200).json({ 
        success: true, 
        locations: cached.locations,
        cached: true
      });
    } else {
      // Cache expired, remove it
      locationCache.delete(normalizedQuery);
    }
  }

  // Add India context to search if not already specified
  let searchQuery = query.trim();
  if (!searchQuery.toLowerCase().includes('india') && !searchQuery.toLowerCase().includes('kerala')) {
    searchQuery = searchQuery + ', India';
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=15&addressdetails=1&countrycodes=in`;

  const options = {
    headers: {
      'User-Agent': 'Festivo-Institution-Finder/1.0 (santhigiri.edu)'
    },
    timeout: 15000 // 15 second timeout
  };

  https.get(url, options, (response) => {
    let data = '';

    // Handle rate limiting
    if (response.statusCode === 429) {
      console.warn('Nominatim rate limit hit. Returning empty results with message.');
      return res.status(200).json({ 
        success: true, 
        locations: [], 
        message: 'Search service is temporarily busy. Please try again in a moment.' 
      });
    }

    // Handle other non-200 responses
    if (response.statusCode !== 200) {
      console.error('Nominatim API error - Status:', response.statusCode);
      response.on('data', () => {}); // Drain the response
      return res.status(200).json({ 
        success: true, 
        locations: [], 
        message: 'Unable to search locations at this time. Please try again later.' 
      });
    }

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        if (!data || data.trim().length === 0) {
          // Cache empty results too
          locationCache.set(normalizedQuery, {
            locations: [],
            timestamp: Date.now()
          });
          return res.status(200).json({ 
            success: true, 
            locations: [], 
            message: 'No locations found for your search.' 
          });
        }

        // Check if it's HTML error response (e.g., from Cloudflare)
        if (data.trim().startsWith('<')) {
          console.error('Nominatim returned HTML error, likely rate limited or blocked');
          return res.status(200).json({ 
            success: true, 
            locations: [], 
            message: 'Search service temporarily unavailable. Please try again shortly.' 
          });
        }

        const locations = JSON.parse(data);
        if (locations && Array.isArray(locations) && locations.length > 0) {
          // Cache successful results
          locationCache.set(normalizedQuery, {
            locations: locations,
            timestamp: Date.now()
          });
          res.status(200).json({ 
            success: true, 
            locations: locations 
          });
        } else {
          // Cache empty results
          locationCache.set(normalizedQuery, {
            locations: [],
            timestamp: Date.now()
          });
          res.status(200).json({ 
            success: true, 
            locations: [], 
            message: 'No locations found for your search.' 
          });
        }
      } catch (error) {
        console.error('JSON parse error:', error.message);
        res.status(200).json({ 
          success: true, 
          locations: [], 
          message: 'Error processing search results. Please try again.' 
        });
      }
    });
  }).on('error', (error) => {
    console.error('Location search error:', error.message);
    res.status(200).json({ 
      success: true, 
      locations: [], 
      message: 'Network error. Please check your connection and try again.' 
    });
  }).on('timeout', () => {
    console.error('Location search timeout');
    res.status(200).json({ 
      success: true, 
      locations: [], 
      message: 'Search timed out. Please try again.' 
    });
  });
});

module.exports = router;
