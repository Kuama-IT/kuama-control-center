import { z } from "zod";

const githubUserSchema = z.object({
  login: z.string(),
  id: z.number(),
  node_id: z.string(),
  avatar_url: z.string().url(),
  gravatar_id: z.string().nullable(),
  url: z.string().url(),
  html_url: z.string().url(),
  followers_url: z.string().url(),
  following_url: z.string(),
  gists_url: z.string(),
  starred_url: z.string(),
  subscriptions_url: z.string().url(),
  organizations_url: z.string().url(),
  repos_url: z.string().url(),
  events_url: z.string(),
  received_events_url: z.string().url(),
  type: z.string(),
  site_admin: z.boolean(),
});

const githubUsersResponseSchema = z.array(githubUserSchema);

export { githubUserSchema, githubUsersResponseSchema };

const githubRepositorySchema = z.object({
  id: z.number(),
  node_id: z.string(),
  name: z.string(),
  full_name: z.string(),
  private: z.boolean(),
  owner: githubUserSchema,
  html_url: z.string().url(),
  description: z.string().nullable(),
  fork: z.boolean(),
  url: z.string().url(),
  forks_url: z.string().url(),
  keys_url: z.string(),
  collaborators_url: z.string(),
  teams_url: z.string().url(),
  hooks_url: z.string().url(),
  issue_events_url: z.string(),
  events_url: z.string().url(),
  assignees_url: z.string(),
  branches_url: z.string(),
  tags_url: z.string().url(),
  blobs_url: z.string(),
  git_tags_url: z.string(),
  git_refs_url: z.string(),
  trees_url: z.string(),
  statuses_url: z.string(),
  languages_url: z.string().url(),
  stargazers_url: z.string().url(),
  contributors_url: z.string().url(),
  subscribers_url: z.string().url(),
  subscription_url: z.string().url(),
  commits_url: z.string(),
  git_commits_url: z.string(),
  comments_url: z.string(),
  issue_comment_url: z.string(),
  contents_url: z.string(),
  compare_url: z.string(),
  merges_url: z.string().url(),
  archive_url: z.string(),
  downloads_url: z.string().url(),
  issues_url: z.string(),
  pulls_url: z.string(),
  milestones_url: z.string(),
  notifications_url: z.string(),
  labels_url: z.string(),
  releases_url: z.string().url(),
  deployments_url: z.string().url(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  git_url: z.string(),
  ssh_url: z.string(),
  clone_url: z.string().url(),
  svn_url: z.string().url(),
  homepage: z.string().nullable(),
  size: z.number(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  language: z.string().nullable(),
  has_issues: z.boolean(),
  has_projects: z.boolean(),
  has_downloads: z.boolean(),
  has_wiki: z.boolean(),
  has_pages: z.boolean(),
  has_discussions: z.boolean(),
  forks_count: z.number(),
  mirror_url: z.string().nullable(),
  archived: z.boolean(),
  disabled: z.boolean(),
  open_issues_count: z.number(),
  license: z
    .object({
      key: z.string(),
      name: z.string(),
      spdx_id: z.string(),
      url: z.string().nullable(),
      node_id: z.string(),
    })
    .nullable(),
  allow_forking: z.boolean(),
  is_template: z.boolean(),
  web_commit_signoff_required: z.boolean(),
  topics: z.array(z.string()),
  visibility: z.string(),
  forks: z.number(),
  open_issues: z.number(),
  watchers: z.number(),
  default_branch: z.string(),
});

const githubRepositoriesResponseSchema = z.array(githubRepositorySchema);
export type GithubRepositories = z.infer<
  typeof githubRepositoriesResponseSchema
>;

export { githubRepositorySchema, githubRepositoriesResponseSchema };

const githubCommitSchema = z.object({
  sha: z.string(),
  node_id: z.string(),
  commit: z.object({
    author: z.object({
      name: z.string(),
      email: z.string(),
      date: z.string(),
    }),
    committer: z.object({
      name: z.string(),
      email: z.string(),
      date: z.string(),
    }),
    message: z.string(),
    tree: z.object({
      sha: z.string(),
      url: z.string().url(),
    }),
    url: z.string().url(),
    comment_count: z.number(),
    verification: z.object({
      verified: z.boolean(),
      reason: z.string(),
      signature: z.string().nullable(),
      payload: z.string().nullable(),
    }),
  }),
  url: z.string().url(),
  html_url: z.string().url(),
  comments_url: z.string().url(),
  author: githubUserSchema.nullable(),
  committer: githubUserSchema.nullable(),
  parents: z.array(
    z.object({
      sha: z.string(),
      url: z.string().url(),
      html_url: z.string().url(),
    }),
  ),
});

const githubCommitsResponseSchema = z.array(githubCommitSchema);

export type GithubCommits = z.infer<typeof githubCommitsResponseSchema>;

export { githubCommitSchema, githubCommitsResponseSchema };
