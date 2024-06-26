import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: 5432,
});

export const query = async (
  text: string,
  params?: (string | number | boolean)[],
): Promise<pg.QueryResult | undefined> => {
  // gather information about response time and result
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log('Query Results: ', {
      text,
      duration,
      params,
      res,
      rows: res.rowCount,
    });

    return res;
  } catch (err) {
    throw new Error(`Query Error: ${text}\n${(err as Error).stack}`);
  }
};
