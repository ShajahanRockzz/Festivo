const db = require('./config/db');

const queries = [
  "ALTER TABLE tbl_fests ADD COLUMN result_status VARCHAR(50) DEFAULT 'pending' AFTER status",
  "CREATE TABLE IF NOT EXISTS tbl_competitions (comp_id INT PRIMARY KEY AUTO_INCREMENT, fest_id INT NOT NULL, comp_name VARCHAR(255), description TEXT, max_members INT DEFAULT 0, reg_count INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (fest_id) REFERENCES tbl_fests(fest_id) ON DELETE CASCADE)",
  "CREATE TABLE IF NOT EXISTS tbl_fest_coordinators (coord_id INT PRIMARY KEY AUTO_INCREMENT, fest_id INT NOT NULL, coord_name VARCHAR(255), coord_email VARCHAR(255), coord_phone VARCHAR(20), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (fest_id) REFERENCES tbl_fests(fest_id) ON DELETE CASCADE)"
];

let completed = 0;

queries.forEach((query, idx) => {
  db.query(query, (err) => {
    completed++;
    if(err) {
      console.log(`⚠ Query ${idx+1}: ${err.message}`);
    } else {
      console.log(`✓ Query ${idx+1} executed`);
    }
    if(completed === queries.length) {
      console.log('\n✓ Database migration complete');
      db.end();
    }
  });
});
