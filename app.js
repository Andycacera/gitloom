import express from "express";
import { discordRouter } from "./routes/discordRoutes.js";
import { githubRouter } from "./routes/githubRoutes.js";

export function createApp() {
  const app = express();

  /* THIS ROUTER MUST BE THE FIRST BECUASE IT USES RAW BODY */
  app.use("/github", githubRouter);

  app.use(express.json());
  app.use(discordRouter);

  return app;
}
