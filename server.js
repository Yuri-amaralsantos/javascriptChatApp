const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow frontend access
    }
});

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from "Bearer TOKEN"
    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

// Register endpoint
app.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
            [username, hashedPassword, email]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.rows[0].id, username: user.rows[0].username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected route
app.get("/protected", authenticateToken, async (req, res) => {
    try {
        const user = await pool.query("SELECT username FROM users WHERE id = $1", [req.user.userId]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ username: user.rows[0].username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// WebSocket for real-time chat
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chatMessage", (msg) => {
        io.emit("chatMessage", msg); // Send message to all users
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
