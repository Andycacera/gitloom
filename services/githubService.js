export const githubService = {
  formatMessage(event, payload) {
    const repo = payload.repository?.full_name || "repo";

    if (event === "push") {
      const pusher = payload.pusher?.name || "a user";
      const branch = payload.ref?.replace("refs/heads/", "");
      const commits =
        payload.commits
          ?.map(
            (c) => `• ${c.message} (${c.id.slice(0, 7)}) by ${c.author?.name}`
          )
          .join("\n") || "— no commits —";

      return [
        `🟦 **push** in **${repo}**`,
        `👤 ${pusher}`,
        `🌿 ${branch}`,
        commits,
      ].join("\n");
    }

    if (event === "pull_request") {
      const action = payload.action;
      const pr = payload.pull_request;
      return [
        `🟣 PR **${action}** in **${repo}**`,
        `#${pr.number} ${pr.title}`,
        pr.html_url,
      ].join("\n");
    }

    return `📦 Event **${event}** in **${repo}**`;
  },
};
