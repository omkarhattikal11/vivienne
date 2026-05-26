const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'vivienne',
    multipleStatements: true
});

const sql1 = `
    CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const sql2 = `
    INSERT IGNORE INTO admins (name, email, password)
    SELECT name, email, password FROM users WHERE role = 'seller';
`;

const sql3 = `
    DELETE FROM users WHERE role = 'seller';
`;

const sql4 = `
    ALTER TABLE users DROP COLUMN role;
`;

connection.query(sql1, (err) => {
    if (err) throw err;
    connection.query(sql2, (err) => {
        if (err) throw err;
        connection.query(sql3, (err) => {
            if (err) throw err;
            connection.query(sql4, (err) => {
                if (err && err.code !== 'ER_CANT_DROP_FIELD_OR_KEY') {
                    console.error("Migration error:", err);
                } else {
                    console.log("Admins table created, data migrated, and users table cleaned.");
                }
                connection.end();
            });
        });
    });
});
