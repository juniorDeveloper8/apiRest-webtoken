
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root' ,
  password: process.env.DB_PASSWORD || '123456789',
  database: process.env.DB_NAME || 'mua',
  port: process.env.DB_PORT || 3306
});

export default pool;
