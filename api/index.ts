import app from "../src/app";
import { pool } from "../src/config/db";
import { initDb } from "../src/db/initdb";

let initialized = false;

async function initialize() {
  if (!initialized) {
    await pool.query("SELECT NOW()");
    await initDb();
    initialized = true;
  }
}

initialize();

export default app;
