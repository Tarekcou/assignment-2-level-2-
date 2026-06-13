import app from "./app";
import { pool } from "./config/db";
import { initDb } from "./db/initdb";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database Connected");

    await initDb();
    console.log("Database Initialized");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
}

startServer();
