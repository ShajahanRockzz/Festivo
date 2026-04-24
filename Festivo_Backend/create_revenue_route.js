const express = require('express');
const router = express.Router();
const db = require('./config/db');
const fs = require('fs');

const routerContent = `var express = require('express');
var router = express.Router();
var db = require('../config/db');

router.get('/admin', function(req, res) {
  const query = \`
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
  \`;

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

module.exports = router;`;

fs.writeFileSync('./routes/revenue.js', routerContent, 'utf8');

let appJs = fs.readFileSync('./app.js', 'utf8');
if(!appJs.includes('revenueRouter')) {
    appJs = appJs.replace("var usersRouter = require('./routes/users');", 
    "var usersRouter = require('./routes/users');\nvar revenueRouter = require('./routes/revenue');");
    
    appJs = appJs.replace("app.use('/api/users', usersRouter);",
    "app.use('/api/users', usersRouter);\napp.use('/api/revenue', revenueRouter);");
    
    fs.writeFileSync('./app.js', appJs, 'utf8');
}
console.log('revenue route created');
