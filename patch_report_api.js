const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'Festivo_Backend', 'routes', 'fest.js');
let content = fs.readFileSync(targetFile, 'utf8');

const apiCode = `
router.get('/participation-report/:institutionId', (req, res) => {
  const institutionId = req.params.institutionId;
  const db = require('../config/db');

  const festQuery = \`
    SELECT 
      f.fest_id,
      f.fest_name,
      COUNT(cr.competitionregid) as participant_count
    FROM tbl_fests f
    LEFT JOIN tbl_competitions c ON f.fest_id = c.fest_id
    LEFT JOIN tbl_competitionreg cr ON c.competition_id = cr.competitionid
    WHERE f.institution_id = ?
    GROUP BY f.fest_id, f.fest_name
  \`;

  const compQuery = \`
    SELECT 
      f.fest_name,
      c.competition_id,
      c.competition_name,
      COUNT(cr.competitionregid) as participant_count
    FROM tbl_competitions c
    JOIN tbl_fests f ON c.fest_id = f.fest_id
    LEFT JOIN tbl_competitionreg cr ON c.competition_id = cr.competitionid
    WHERE f.institution_id = ?
    GROUP BY c.competition_id, c.competition_name, f.fest_name
  \`;

  db.query(festQuery, [institutionId], (err1, festResults) => {
    if (err1) return res.status(500).json({ success: false, message: 'DB Error' });
    
    db.query(compQuery, [institutionId], (err2, compResults) => {
      if (err2) return res.status(500).json({ success: false, message: 'DB Error' });
      
      res.json({
        success: true,
        festData: festResults,
        competitionData: compResults
      });
    });
  });
});

module.exports = router;
`;

content = content.replace('module.exports = router;', apiCode);

fs.writeFileSync(targetFile, content);
console.log('Done!');
