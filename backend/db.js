const { Pool } = require("pg");

const pool = new Pool({
  user: "taskuser",
  host: "localhost",
  database: "taskdb",
  password: "taskpass123",
  port: 5432,
});

module.exports = pool;