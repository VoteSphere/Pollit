import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  database: "pollit",
  user: "postgres",
  password: "mypassword",
  port: 5432,
});

export const query = async (
  text: string,
  params?: (string | number | boolean)[]
): Promise<pg.QueryResult | undefined> => {
  // gather information about response time and result
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    console.log("Query Results: ", {
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

// IF we have complex transactions that need to be handled together, we want extra debugging steps, or we want to implement automated rollbacks upon error
// export const getClient = async () => {
//   const client = await pool.connect();
//   try {
//     const query = client.query;
//     const release = client.release;
//     // set a timeout of 5 seconds, after which we will log this client's last query
//     const timeout = setTimeout(() => {
//       console.error("A client has been checked out for more than 5 seconds!");
//       console.error(
//         `The last executed query on this client was: ${client.lastQuery}`
//       );
//     }, 5000);
//     // monkey patch the query method to keep track of the last query executed
//     client.query = (...args) => {
//       client.lastQuery = args;
//       return query.apply(client, args);
//     };
//   } catch (err) {
//     await client.query("ROLLBACK");
//     throw new Error("Error in getClient, Rollback applied");
//   } finally {
//     client.release = () => {
//       // clear our timeout
//       clearTimeout(timeout);
//       // set the methods back to their old un-monkey-patched version
//       client.query = query;
//       client.release = release;
//       return release.apply(client);
//     };
//   }
//   return client;
// };
