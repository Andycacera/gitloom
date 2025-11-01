import axios from "axios";
import { config } from "../config.js";

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.data) options.data = JSON.stringify(options.data);
  // Use fetch to make requests
  const res = await axios({
    method: options.method,
    url,
    headers: {
      Authorization: `Bot ${config.discord.botToken}`,
      "Content-Type": "application/json; charset=UTF-8",
      "User-Agent": `DiscordBot (https://github.com/Andycacera/gitloom, ${config.version})`,
    },
    ...options,
  });

  // throw API errors
  if (res.status !== 200) {
    const data = res.data;
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: "PUT", data: commands });
    console.log("Commands registered successfully 🎉");
  } catch (err) {
    console.error(err);
  }
}
