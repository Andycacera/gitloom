import { repoStore } from "../db/index.js";

export const repoService = {
  async registerRepo(repoFullName, { channelId, guildId = null, events = [] }) {
    await repoStore.addRepo(repoFullName, { channelId, guildId, events });
  },

  async findByRepo(repoFullName) {
    return repoStore.getRepo(repoFullName);
  },

  async listAll() {
    return repoStore.listRepos();
  },

  async remove(repoFullName) {
    return repoStore.deleteRepo(repoFullName);
  },
};
