import "dotenv/config";

export const config = {
  version: process.env.VERSION || "0.0.1",
  port: process.env.PORT || 3000,
  discord: {
    publicKey: process.env.DISCORD_PUBLIC_KEY,
    appId: process.env.DISCORD_APPLICATION_ID,
    botToken: process.env.DISCORD_BOT_TOKEN,
  },
  github: {
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
  },
  db: {
    postgresUrl: process.env.POSTGRES_URL || null,
  },
};
