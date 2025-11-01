import { config } from "../config.js";
import { InstallGlobalCommands } from "../utils/discordUtils.js";
import { gitLoomCommands } from "./gitLoomCommands.js";

InstallGlobalCommands(config.discord.appId, gitLoomCommands);
