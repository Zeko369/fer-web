const { Pool } = require("pg");

const pool = new Pool({
  user: "dev",
  host: "localhost",
  database: "web1-lab4",
  password: "foobar123",
  port: 5432
});

module.exports = {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params).then((res) => {
      const duration = Date.now() - start;
      //console.log('executed query', {text, params, duration, rows: res.rows});
      return res;
    });
  },
  pool: pool
};
