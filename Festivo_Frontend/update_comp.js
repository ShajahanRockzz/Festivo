const fs = require('fs');
const file = '../Festivo_Backend/routes/competitions.js';
let content = fs.readFileSync(file, 'utf8');

const newRoute = `
// POST - Register for A Competition
router.post('/register', (req, res) => {
  const { compId, participantId, type } = req.body;
  
  // Base check
  if (!compId || !participantId) {
    return res.status(400).json({ success: false, message: 'Missing compId or participantId' });
  }

  // Check if competition exists and get type
  const compQuery = 'SELECT type FROM tbl_competitions WHERE competition_id = ?';
  db.query(compQuery, [compId], (err, compResults) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });
    if (compResults.length === 0) return res.status(404).json({ success: false, message: 'Competition not found' });
    
    // Check if participant already registered
    const checkRegQuery = 'SELECT * FROM tbl_competitionreg WHERE competitionid = ? AND participantid = ?';
    db.query(checkRegQuery, [compId, participantId], (err, regResults) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });
      if (regResults.length > 0) return res.status(400).json({ success: false, message: 'Already registered for this competition' });

      // Insert main registration
      const insRegQuery = 'INSERT INTO tbl_competitionreg (competitionid, chessno, attendance, regdate, participantid) VALUES (?, 0, "absent", CURDATE(), ?)';
      db.query(insRegQuery, [compId, participantId], (err, insRegResult) => {
        if (err) return res.status(500).json({ success: false, message: 'Registration failed', error: err });
        
        const regId = insRegResult.insertId;

        if (type === 'group') {
          try {
             let names = req.body['member_names[]'] || req.body['member_names'];
             let contacts = req.body['member_contacts[]'] || req.body['member_contacts'];
             let emails = req.body['member_emails[]'] || req.body['member_emails'];
             
             // Normalize to array if single string
             if (typeof names === 'string') names = [names];
             if (typeof contacts === 'string') contacts = [contacts];
             if (typeof emails === 'string') emails = [emails];
             
             if (names && names.length > 0) {
                const grpQuery = "INSERT INTO tbl_competition_group_details (participantname, collegeidproof, contact_no, email, competitionregid) VALUES ?";
                const values = [];
                for (let i = 0; i < names.length; i++) {
                   // Match file dynamically using prefix collegeidproof_ or use array indexing if multer mapped it
                   // If we use collegeidproof array, multer might have it in req.files
                   let idproof = '';
                   if (req.files) {
                     const f = req.files.find(f => f.fieldname === 'collegeidproof_' + i);
                     if (f) idproof = f.filename;
                   }
                   values.push([names[i], idproof, contacts[i], emails[i], regId]);
                }
                
                db.query(grpQuery, [values], (err) => {
                   if (err) return res.status(500).json({ success: false, message: 'Group details insert failed', error: err });
                   res.json({ success: true, message: 'Group registered successfully' });
                });
             } else {
                res.json({ success: true, message: 'Registered successfully, no group members added' });
             }
          } catch(e) {
             res.status(500).json({ success: false, message:'Group parsing error', error: e.message });
          }
        } else {
          res.json({ success: true, message: 'Registered successfully' });
        }
      });
    });
  });
});
`;

content = content.replace("module.exports = router;", newRoute + "\nmodule.exports = router;");
fs.writeFileSync(file, content);
