import { Pool, PoolClient, QueryResult } from "pg";

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

// Export the pool for direct queries
export const db = pool;

// Helper function to execute queries
export async function query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  if (process.env.NODE_ENV === "development") {
    console.log("Executed query", { text, duration, rows: res.rowCount });
  }

  return res;
}

// Helper function to get a client from the pool for transactions
export async function getClient(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  await pool.end();
}

export default db;
