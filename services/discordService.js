import { config } from "../config.js";
import { DiscordRequest } from "../utils/discordUtils.js";

export const discordService = {
  async sendMessage(channelId, content) {
    const res = await DiscordRequest(`channels/${channelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${config.discord.botToken}`,
        "Content-Type": "application/json",
      },
      data: { content },
    });

    console.log("sendMessage response: ", res.data);
    if (!res.ok) {
      const data = res.data;
      throw new Error(`Discord error ${res.status}: ${data}`);
    }
  },
};
