import pkg from "pg";
const { Pool } = pkg;

export function createPgRepoStore(connectionString) {
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("neon.tech")
      ? { rejectUnauthorized: false }
      : false,
  });

  const init = async () => {
    await pool.query(`
      create table if not exists repo_channels (
        id serial primary key,
        repo_full_name text not null,
        channel_id text not null,
        guild_id text,
        events jsonb default '[]'::jsonb,
        constraint uniq_repo unique (repo_full_name)
      );
    `);
  };
  init().catch((err) => console.error("[pgRepoStore] init error", err));

  return {
    async addRepo(repoFullName, { channelId, guildId = null, events = [] }) {
      await pool.query(
        `
        insert into repo_channels (repo_full_name, channel_id, guild_id, events)
        values ($1, $2, $3, $4)
        on conflict (repo_full_name)
        do update set channel_id = excluded.channel_id,
                      guild_id   = excluded.guild_id,
                      events     = excluded.events
        `,
        [repoFullName, channelId, guildId, JSON.stringify(events)]
      );
      return true;
    },

    async getRepo(repoFullName) {
      const { rows } = await pool.query(
        `select repo_full_name, channel_id, guild_id, events from repo_channels where repo_full_name = $1`,
        [repoFullName]
      );
      return rows[0] || null;
    },

    async listRepos() {
      const { rows } = await pool.query(
        `select repo_full_name, channel_id, guild_id, events from repo_channels order by repo_full_name asc`
      );
      return rows;
    },

    async deleteRepo(repoFullName) {
      await pool.query(`delete from repo_channels where repo_full_name = $1`, [
        repoFullName,
      ]);
      return true;
    },
  };
}
