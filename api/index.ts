import app from "../src/app";
import { initDb } from "../src/db/initdb";

let initPromise: Promise<void> | null = null;

async function initialize() {
  if (!initPromise) {
    initPromise = initDb(); // ensures only ONE execution per instance
  }
  await initPromise;
}

// run but don't block export
initialize();

export default app;
