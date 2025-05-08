// lib/db.js
import mysql from 'mysql2/promise';
import fs from 'fs';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync('/etc/ssl/cert.pem'), // or './certs/cert.pem' in project
  },
});

export default pool;