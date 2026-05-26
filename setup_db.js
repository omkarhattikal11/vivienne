const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234'
});

connection.query('CREATE DATABASE IF NOT EXISTS vivienne', (err) => {
    if (err) {
        console.error("Error creating DB. Please ensure MySQL is running and password is correct.", err);
        process.exit(1);
    }
    console.log('Database vivienne created or already exists.');
    
    connection.changeUser({ database: 'vivienne' }, (err) => {
        if (err) throw err;
        
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        const createProductsTable = `
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                price INT NOT NULL,
                image_url VARCHAR(255) DEFAULT 'ethnic-sarees.png',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createOrdersTable = `
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                item_name VARCHAR(255) NOT NULL,
                amount INT NOT NULL,
                status VARCHAR(50) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        connection.query(createUsersTable, (err) => {
            if (err) throw err;
            console.log('Users table ready.');
            
            connection.query(createProductsTable, (err) => {
                if (err) throw err;
                console.log('Products table ready.');
                
                connection.query(createOrdersTable, (err) => {
                    if (err) throw err;
                    console.log('Orders table ready.');
                    
                    // Insert dummy products if empty
                    connection.query('SELECT COUNT(*) AS cnt FROM products', (err, results) => {
                        if (results[0].cnt === 0) {
                            const dummyProducts = [
                                ['Kanjeevaram Saree', 'women', 1200, 'ethnic-sarees.png'],
                                ['Velvet Sherwani', 'men', 2000, 'sherwani.png'],
                                ['Kids Silk Kurta', 'kids', 800, 'kids-kurta.png']
                            ];
                            connection.query('INSERT INTO products (name, category, price, image_url) VALUES ?', [dummyProducts], (err) => {
                                if (err) throw err;
                                console.log('Inserted dummy products.');
                                
                                const dummyOrders = [
                                    ['Rahul Sharma', 'Designer Tuxedo', 2500, 'Completed'],
                                    ['Priya Patel', 'Bridal Lehenga', 8000, 'Pending'],
                                    ['Anita Reddy', 'Grand Wedding Hall', 45000, 'Completed']
                                ];
                                connection.query('INSERT INTO orders (customer_name, item_name, amount, status) VALUES ?', [dummyOrders], (err) => {
                                    if (err) throw err;
                                    console.log('Inserted dummy orders.');
                                    connection.end();
                                });
                            });
                        } else {
                            connection.end();
                        }
                    });
                });
            });
        });
    });
});
