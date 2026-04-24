const fs = require('fs');
const path = './Festivo_Backend/routes/login.js';
let code = fs.readFileSync(path, 'utf8');

const replacement = `
        const sendResponse = (extraData = {}) => {
            res.status(200).json({
              success: true,
              message: 'Login successful',
              user: Object.assign({}, userResponse, extraData)
            });
        };

        const fetchRoleData = () => {
           let roleLower = user.role.toLowerCase();
           if (roleLower === 'institution') {
              db.query('SELECT institution_id FROM tbl_institution WHERE login_id = ?', [user.login_id], (err, r) => {
                 sendResponse(r && r.length > 0 ? { institutionId: r[0].institution_id } : {});
              });
           } else if (roleLower === 'participant') {
              db.query('SELECT participantid, participantname FROM tbl_participant WHERE loginid = ?', [user.login_id], (err, r) => {
                 sendResponse(r && r.length > 0 ? { participantid: r[0].participantid, participantname: r[0].participantname } : {});
              });
           } else if (roleLower === 'coordinator') {
              db.query('SELECT coordinator_id, name as coordinator_name FROM tbl_coordinators WHERE login_id = ?', [user.login_id], (err, r) => {
                 sendResponse(r && r.length > 0 ? { coordinator_id: r[0].coordinator_id, name: r[0].coordinator_name } : {});
              });
           } else {
              sendResponse();
           }
        };

        fetchRoleData();
`;

code = code.replace(/if\s*\(user\.role\s*===\s*'Institution'\)\s*\{[\s\S]*?\}\s*else\s*\{[\s\S]*?\}\s*}\s*\);\s*\} else \{/g, replacement + "\n      });\n    } else {");

fs.writeFileSync(path, code);
console.log('Done!');
