const {Pool} = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
});

pool.connect()
  .then(() => console.log(" PostgreSQL Connected"))
  .catch(err => console.error(" DB Connection Error:", err));

module.exports = pool;