const fs = require('fs');
const file = 'Festivo_Backend/routes/competitions.js';
let content = fs.readFileSync(file, 'utf8');

const oldCode = outer.get('/:compId', (req, res) => {
    const { compId } = req.params;

    const query = \\\
      SELECT *
      FROM tbl_competitions
      WHERE competition_id = ?
    \\\;

    db.query(query, [compId], (err, results) => {
      if (err) {
        console.error('Error fetching competition:', err);
        return res.status(500).json({
          success: false,
          message: 'Error fetching competition'
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      res.json({
        success: true,
        data: results[0]
      });
    });
  });;

const newCode = outer.get('/:compId', (req, res) => {
    const { compId } = req.params;

    const query = \\\
      SELECT *
      FROM tbl_competitions
      WHERE competition_id = ?
    \\\;

    db.query(query, [compId], (err, results) => {
      if (err) {
        console.error('Error fetching competition:', err);
        return res.status(500).json({
          success: false,
          message: 'Error fetching competition'
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      const compData = results[0];
      const countQuery = 'SELECT COUNT(*) as regCount FROM tbl_competitionreg WHERE competitionid = ?';
      db.query(countQuery, [compId], (countErr, countResults) => {
          if (!countErr && countResults && countResults.length > 0) {
              compData.registrationCount = countResults[0].regCount;
          } else {
              compData.registrationCount = 0;
          }
          res.json({
            success: true,
            data: compData
          });
      });
    });
  });;

content = content.replace(oldCode, newCode);
fs.writeFileSync(file, content);
