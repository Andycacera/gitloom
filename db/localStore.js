// Almacenamiento en memoria: { repoFullName: { channelId, guildId? } }
const repoMap = new Map();

export const memoryRepoStore = {
  async addRepo(repoFullName, data) {
    repoMap.set(repoFullName, data);
    return true;
  },

  async getRepo(repoFullName) {
    return repoMap.get(repoFullName) || null;
  },

  async listRepos() {
    return Array.from(repoMap.entries()).map(([repo, data]) => ({
      repoFullName: repo,
      ...data,
    }));
  },

  async deleteRepo(repoFullName) {
    return repoMap.delete(repoFullName);
  },
};
