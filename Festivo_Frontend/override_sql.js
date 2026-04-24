const fs = require('fs');
const backPath = 'C:/Users/shaja/OneDrive/Desktop/Santhigiri/S6/Main Project/Project/Festivo/Festivo_Backend/routes/participants.js';
let content = fs.readFileSync(backPath, 'utf8');

const oldSql = "      SELECT\n        cr.competitionregid,\n        cr.attendance,\n        cr.regdate,\n        c.competition_name,\n        c.competition_date,\n        c.type,\n        c.image,\n        c.fest_id,\n        f.fest_name,\n        i.institution_name,\n        r.position,\n        c.res_status\n      FROM tbl_competitionreg cr\n      INNER JOIN tbl_competitions c ON cr.competitionid = c.competition_id      \n      INNER JOIN tbl_fests f ON c.fest_id = f.fest_id\n      LEFT JOIN tbl_institution i ON f.institution_id = i.institution_id        \n      LEFT JOIN tbl_result r ON r.competition_reg_id = cr.competitionregid      \n      WHERE cr.participantid = ?\n      ORDER BY cr.regdate DESC";

const newSql = "      SELECT\n        cr.competitionregid,\n        cr.attendance,\n        cr.regdate,\n        c.competition_name,\n        c.competition_date,\n        c.type,\n        c.image,\n        c.fest_id,\n        f.fest_name,\n        f.Image as fest_image,\n        i.institution_name,\n        r.position,\n        c.res_status\n      FROM tbl_competitionreg cr\n      INNER JOIN tbl_competitions c ON cr.competitionid = c.competition_id      \n      INNER JOIN tbl_fests f ON c.fest_id = f.fest_id\n      LEFT JOIN tbl_institution i ON f.institution_id = i.institution_id        \n      LEFT JOIN tbl_result r ON r.competition_reg_id = cr.competitionregid      \n      WHERE cr.participantid = ?\n      ORDER BY cr.regdate DESC";

content = content.replace(oldSql, newSql);
fs.writeFileSync(backPath, content);
console.log('Backend SQL overridden with fest_image.');
