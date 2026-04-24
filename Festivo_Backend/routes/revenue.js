var express = require('express');
var router = express.Router();
var db = require('../config/db');

router.get('/admin', function(req, res) {
  const query = `
    SELECT 
      p.payment_id,
      p.payment_date,
      p.type,
      p.amount,
      CASE 
        WHEN p.type = 'subscription' THEN i_sub.institution_name
        WHEN p.type = 'registration' THEN i_reg.institution_name
        ELSE 'Unknown'
      END as institution_name
    FROM tbl_payment p
    LEFT JOIN tbl_institution i_sub ON p.type = 'subscription' AND p.typeid = i_sub.institution_id
    LEFT JOIN tbl_competitionreg cr ON p.type = 'registration' AND p.typeid = cr.competitionregid
    LEFT JOIN tbl_competitions c ON cr.competitionid = c.competition_id
    LEFT JOIN tbl_fests f ON c.fest_id = f.fest_id
    LEFT JOIN tbl_institution i_reg ON f.institution_id = i_reg.institution_id
    ORDER BY p.payment_date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'DB Error' });
    }
    
    let totalRevenue = 0;
    let subscriptionRevenue = 0;
    let registrationRevenue = 0;
    const byInstitution = {};

    results.forEach(r => {
      const amt = Number(r.amount) || 0;
      totalRevenue += amt;
      
      if (r.type === 'subscription') subscriptionRevenue += amt;
      if (r.type === 'registration') registrationRevenue += amt;

      const inst = r.institution_name || 'N/A';
      if (!byInstitution[inst]) byInstitution[inst] = 0;
      byInstitution[inst] += amt;
    });

    const institutionData = Object.keys(byInstitution).map(name => ({
      name,
      amount: byInstitution[name]
    })).sort((a,b) => b.amount - a.amount);

    res.json({
      success: true,
      data: {
        totalRevenue,
        subscriptionRevenue,
        registrationRevenue,
        institutionData,
        history: results
      }
    });
  });
});


router.get('/institution/:institutionId', function(req, res) {
  const institutionId = req.params.institutionId;

  const query = `
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
  `;

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
