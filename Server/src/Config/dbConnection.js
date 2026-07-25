const mysql = require("mysql2/promise");
require("dotenv").config();

// Authors: Nishtha & Pinki

// Create a connection pool for the MySQL database.

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check if the database connection is successful.

db.getConnection()
  .then((connection) => {
    console.log("MYSQL connected");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

module.exports = db;
