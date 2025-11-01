import { config } from "../config.js";
// import { createPgRepoStore } from "./db.js";
import { memoryRepoStore } from "./localStore.js";

let repoStore = memoryRepoStore;

if (config.db.postgresUrl) {
  console.log("[db] Using Postgres store");
  // repoStore = createPgRepoStore(config.db.postgresUrl);
} else {
  console.log("[db] Using in-memory store");
}

export { repoStore };
