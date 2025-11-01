export const gitLoomCommands = [
  {
    name: "gh-add",
    description:
      "Associate a GitHub repository to this channel to receive webhook events",
    options: [
      {
        name: "repo",
        description: "Full repository name (owner/repo)",
        type: 3, // STRING
        required: true,
      },
      {
        name: "events",
        description:
          "Events to listen for (separated by commas, e.g., push,pull_request)",
        type: 3, // STRING optional
        required: false,
      },
    ],
  },
  {
    name: "gh-list",
    description: "Lists the GitHub repositories registered in this server",
  },
  {
    name: "gh-remove",
    description: "Removes the subscription of a GitHub repository",
    options: [
      {
        name: "repo",
        description: "Full repository name (owner/repo)",
        type: 3, // STRING
        required: true,
      },
    ],
  },
  {
    name: "gh-hello-world",
    description:
      "Sends a message to say hello world from the GitLoom bot. This is a test command.",
  },
];
