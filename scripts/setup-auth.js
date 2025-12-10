// Setup script to create auth tables and test user
const { Client } = require("pg");
const bcrypt = require("bcryptjs");

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:dd8dm03p3tma5j53@51.210.105.182:5432/postgres";

async function setupAuth() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("✓ Connected to database");

    // Create users table
    console.log("\nCreating users table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Users table created");

    // Create index
    await client.query(`
      CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
    `);
    console.log("✓ Email index created");

    // Create accounts table
    console.log("\nCreating accounts table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        provider TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at INTEGER,
        token_type TEXT,
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        UNIQUE(provider, "providerAccountId")
      );
    `);
    console.log("✓ Accounts table created");

    // Create sessions table
    console.log("\nCreating sessions table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "sessionToken" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      );
    `);
    console.log("✓ Sessions table created");

    // Create verification_tokens table
    console.log("\nCreating verification_tokens table...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);
    console.log("✓ Verification tokens table created");

    // Create test user
    console.log("\nCreating test user...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const result = await client.query(
      `
      INSERT INTO users (name, email, password, "emailVerified")
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email;
    `,
      ["Test User", "test@example.com", hashedPassword, new Date()],
    );

    if (result.rowCount > 0) {
      console.log("✓ Test user created:");
      console.log("  Email: test@example.com");
      console.log("  Password: password123");
    } else {
      console.log("  Test user already exists");
    }

    console.log("\n✅ Auth setup complete!");
    console.log("\nYou can now:");
    console.log("1. Start the app: npm run dev");
    console.log("2. Login with: test@example.com / password123");
    console.log("3. Or create a new user via the registration API");
  } catch (error) {
    console.error("❌ Error setting up auth:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupAuth();
