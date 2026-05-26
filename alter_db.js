const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'vivienne'
});

connection.query("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'", (err) => {
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
        console.error("Error altering table", err);
    } else {
        console.log("Added role column to users table");
    }
    connection.end();
});
