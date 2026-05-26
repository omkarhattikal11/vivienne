const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'vivienne'
});

connection.query("ALTER TABLE orders ADD COLUMN seller_name VARCHAR(255) DEFAULT 'Admin'", (err) => {
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
        console.error(err);
    } else {
        console.log("Added seller_name column to orders table.");
    }
    connection.end();
});
