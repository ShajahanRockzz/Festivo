const fs = require('fs');
const fn = 'routes/fest.js';
let content = fs.readFileSync(fn, 'utf-8');

const newAPI = `
router.get('/prize-report/:institutionId', function(req, res, next) {
    const q = \`
        SELECT 
            r.position, 
            c.competition_name, 
            f.fest_name, 
            p.participantname, 
            p.institution_name as participant_college
        FROM tbl_result r
        JOIN tbl_competitions c ON r.competition_id = c.competition_id
        JOIN tbl_fests f ON c.fest_id = f.fest_id
        JOIN tbl_competitionreg cr ON r.competition_reg_id = cr.competitionregid
        JOIN tbl_participant p ON cr.participantid = p.participantid
        WHERE f.institution_id = ?
        ORDER BY f.fest_name, c.competition_name, r.position ASC
    \`;
    db.query(q, [req.params.institutionId], (err, results) => {
        if (err) return res.status(500).json({success: false, message: 'Database error', error: err});
        res.json({success: true, results: results});
    });
});
`;

if (!content.includes('/prize-report/:institutionId')) {
    content = content.replace('module.exports = router;', newAPI + '\nmodule.exports = router;');
    fs.writeFileSync(fn, content);
    console.log('Patched fest.js with /prize-report');
} else {
    console.log('Already patched fest.js with /prize-report');
}
