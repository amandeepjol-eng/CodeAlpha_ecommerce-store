const express = require("express");
const db = require("./config/db");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// Home
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Get products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(results);
    });
});

// Register
app.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [name, email, hashedPassword],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Registration failed"
                        });
                    }

                    res.status(201).json({
                        message: "Registration successful!"
                    });
                }
            );
        }
    );
});


// LOGIN
app.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            const user = results[0];

            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }

            res.json({
                message: "Login successful!",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        }
    );
});

// Place Order
app.post("/orders", (req, res) => {

    const { user_id, total } = req.body;

    if (!user_id || !total) {
        return res.status(400).json({
            message: "User and total are required"
        });
    }

    db.query(
        "INSERT INTO orders (user_id, total) VALUES (?, ?)",
        [user_id, total],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Order failed"
                });
            }

            res.status(201).json({
                message: "Order placed successfully!",
                order_id: result.insertId
            });
        }
    );
});

// Get user's orders
app.get("/orders/:user_id", (req, res) => {

    const user_id = req.params.user_id;

    db.query(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC",
        [user_id],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to fetch orders"
                });
            }

            res.json(results);
        }
    );
});
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});