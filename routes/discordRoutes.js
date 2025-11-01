import {
  verifyKeyMiddleware,
  InteractionType,
  InteractionResponseType,
} from "discord-interactions";
import { config } from "../config.js";
import { repoService } from "../services/repoService.js";

import express from "express";

export const discordRouter = express.Router();

discordRouter.post(
  "/interactions",
  verifyKeyMiddleware(config.discord.publicKey),
  async (req, res) => {
    const { type, data } = req.body;

    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
      const commandName = data.name;

      if (commandName === "gh-add") {
        const repoOpt = data.options?.find((o) => o.name === "repo");
        if (!repoOpt) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "❌ Repo is required", flags: 64 },
          });
        }

        const repoFullName = repoOpt.value;
        const channelId = req.body.channel_id;
        const guildId = req.body.guild_id;

        await repoService.registerRepo(repoFullName, { channelId, guildId });

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `✅ Repo **${repoFullName}** registered in this channel.`,
          },
        });
      }

      if (commandName === "gh-list") {
        const rows = await repoService.listAll();
        const text =
          rows
            .map((r) => `• ${r.repo_full_name} → ${r.channel_id}`)
            .join("\n") || "— empty —";
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: text, flags: 64 },
        });
      }

      if (commandName === "gh-remove") {
        const repoOpt = data.options?.find((o) => o.name === "repo");
        if (!repoOpt) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "❌ Repo is required", flags: 64 },
          });
        }
        await repoService.remove(repoOpt.value);
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `🗑️ Repo **${repoOpt.value}** removed.` },
        });
      }

      if (commandName === "gh-hello-world") {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              "Hey there! This is a test command from GitLoom. The bot is working fine 🎉😎",
          },
        });
      }
    }

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: "Command not supported" },
    });
  }
);
