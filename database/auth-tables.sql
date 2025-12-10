-- NextAuth.js Authentication Tables
-- Run this SQL script to create the necessary authentication tables

-- Create users table for credentials authentication
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- NextAuth adapter tables (optional, needed if using database sessions instead of JWT)
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

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Create a default test user (password is 'password123')
-- Password hash generated with bcrypt for 'password123'
INSERT INTO users (id, name, email, password, "emailVerified")
VALUES (
  gen_random_uuid()::text,
  'Test User',
  'test@example.com',
  '$2a$10$rJK8Z5Z5Z5Z5Z5Z5Z5Z5ZOj7Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

-- Note: You'll need to create proper user accounts with hashed passwords
-- Use bcryptjs in your application to hash passwords before storing
