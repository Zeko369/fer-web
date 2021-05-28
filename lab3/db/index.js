import pg from "pg";

const pool = new pg.Pool({
  user: "dev",
  host: "localhost",
  database: "web1-lab3",
  password: "foobar123",
  port: 5432
});

const log = false;

/**
 * @function
 * @template A
 * @param {string} text
 * @param params
 * @returns {Promise<import("pg").QueryArrayResult<A[]>>}
 */
export const query = (text, params = undefined) => {
  const start = Date.now();
  return pool.query(text, params).then((res) => {
    const duration = Date.now() - start;
    if (log) {
      console.log("executed query", { text, params, duration, rows: res.rows });
    }

    return res;
  });
};

export const disconnect = () => {
  return pool.end();
};
