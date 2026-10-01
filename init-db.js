const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Read the existing product.json
const productsPath = path.join(__dirname, 'product.json');
const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Initialize SQLite database
const db = new sqlite3.Database('database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            // Create products table
            db.run(`CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                image TEXT,
                description TEXT
            )`);

            // Clear existing data to avoid duplicates on re-run
            db.run('DELETE FROM products');

            // Insert data from JSON
            const stmt = db.prepare('INSERT INTO products (id, name, price, image, description) VALUES (?, ?, ?, ?, ?)');
            
            productsData.forEach(product => {
                stmt.run(product.id, product.name, product.price, product.image, product.description);
                console.log(`Inserted product: ${product.name}`);
            });

            stmt.finalize();
            console.log('Database initialized successfully with product data.');
        });
    }
});
