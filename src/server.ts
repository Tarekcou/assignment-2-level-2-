import app from "./app";
import { pool } from "./config/db";
import { initDb } from "./db/initdb";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("Database Connected");
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
