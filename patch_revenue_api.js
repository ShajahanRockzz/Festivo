const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'Festivo_Backend', 'routes', 'revenue.js');
let content = fs.readFileSync(targetFile, 'utf8');

const newRoute = `
router.get('/institution/:institutionId', function(req, res) {
  const institutionId = req.params.institutionId;

  const query = \`
    SELECT 
      f.fest_id,
      f.fest_name,
      c.competition_id,
      c.competition_name,
      p.payment_id,
      p.payment_date,
      p.amount
    FROM tbl_payment p
    JOIN tbl_competitionreg cr ON p.type = 'registration' AND p.typeid = cr.competitionregid
    JOIN tbl_competitions c ON cr.competitionid = c.competition_id
    JOIN tbl_fests f ON c.fest_id = f.fest_id
    WHERE f.institution_id = ?
    ORDER BY p.payment_date DESC
  \`;

  db.query(query, [institutionId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'DB Error' });
    }

    let totalRevenue = 0;
    const byFest = {};
    const byCompetition = {};

    results.forEach(r => {
      const amt = Number(r.amount) || 0;
      totalRevenue += amt;

      const festName = r.fest_name || 'Unknown Fest';
      if (!byFest[festName]) byFest[festName] = 0;
      byFest[festName] += amt;

      const compName = r.competition_name || 'Unknown Competition';
      if (!byCompetition[compName]) byCompetition[compName] = { festName, amount: 0 };
      byCompetition[compName].amount += amt;
    });

    const festData = Object.keys(byFest).map(name => ({
      name,
      amount: byFest[name]
    })).sort((a,b) => b.amount - a.amount);

    const competitionData = Object.keys(byCompetition).map(name => ({
      name,
      festName: byCompetition[name].festName,
      amount: byCompetition[name].amount
    })).sort((a,b) => b.amount - a.amount);

    res.json({
      success: true,
      data: {
        totalRevenue,
        festData,
        competitionData,
        history: results
      }
    });
  });
});

module.exports = router;
`;

content = content.replace('module.exports = router;', newRoute);
fs.writeFileSync(targetFile, content);
console.log('Modified revenue.js');
