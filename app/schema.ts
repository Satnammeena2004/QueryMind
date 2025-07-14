"use server";
import { Client } from "@vercel/postgres";
const c = new Client({
  connectionString:
    "postgresql://neondb_owner:y0QE6ORganls@ep-dry-frost-a5vn3abc-pooler.us-east-2.aws.neon.tech/query_generator?sslmode=require",
});


const queries = [
  `CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,
 
  PRIMARY KEY (identifier, token)
);`,

  `CREATE TABLE accounts
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
 
  PRIMARY KEY (id)
);`,

  `CREATE TABLE sessions
(
  id SERIAL,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,
 
  PRIMARY KEY (id)
);`,

  `CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
 
  PRIMARY KEY (id)
);`,
];

async function createRquiredTable() {
  try {
    await Promise.all(queries.map((q) => c.query(q)));
    console.log("relations succesfully created");
  } catch (error) {
    console.log(error);
    console.log("error while create relations");
  }
}
createRquiredTable();
