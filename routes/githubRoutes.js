import express from "express";
import { config } from "../config.js";
import { verifyGithubSignature } from "../utils/githubSign.js";
import { repoService } from "../services/repoService.js";
import { githubService } from "../services/githubService.js";
import { discordService } from "../services/discordService.js";

export const githubRouter = express.Router();

// necesitamos raw body
githubRouter.use(express.raw({ type: "application/json" }));

githubRouter.post("/", async (req, res) => {
  const signature = req.header("X-Hub-Signature-256") || "";
  const event = req.header("X-GitHub-Event") || "";
  const delivery = req.header("X-GitHub-Delivery") || "";
  const secret = config.github.webhookSecret;

  const rawBody = req.body;

  if (!verifyGithubSignature(rawBody, secret, signature)) {
    return res.status(401).send("invalid signature");
  }

  const payload = JSON.parse(rawBody.toString("utf8"));
  const repoFullName = payload.repository?.full_name;

  console.log(`[github] ${event} ${repoFullName} (${delivery})`);

  const repoConfig = await repoService.findByRepo(repoFullName);
  if (!repoConfig) {
    return res.status(200).send("ok (no target)");
  }

  const message = githubService.formatMessage(event, payload);

  try {
    await discordService.sendMessage(
      repoConfig.channel_id || repoConfig.channelId,
      message
    );
    return res.status(200).send("ok");
  } catch (err) {
    console.error("Error sended to discord", err);
    return res.status(500).send("discord error");
  }
});
