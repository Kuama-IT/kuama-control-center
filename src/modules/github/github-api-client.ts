import {
  GithubCommits,
  githubCommitsResponseSchema,
  GithubRepositories,
  githubRepositoriesResponseSchema,
  githubUsersResponseSchema,
} from "@/modules/github/schemas/github-schemas";
import { serverEnv } from "@/env/server-env";
import { Octokit } from "@octokit/core";
import {
  Api,
  restEndpointMethods,
} from "@octokit/plugin-rest-endpoint-methods";

// TODO does our token have access to PortIT repositories?
class GithubApiClient {
  constructor(
    public readonly organization: string,
    token: string,
  ) {
    const MyOctokit = Octokit.plugin(restEndpointMethods);
    this.octokit = new MyOctokit({ auth: token });
  }

  private readonly octokit: Octokit & Api;

  // people that actually should not be inside our organization
  private usernameBlackList = [
    "rioka", // hoped he would add some knowledge in peer reviews, he did not
    "marcomartini", // added to let him export billing data
    "giuseppemanicardi", // it's a client, he asked to have access to its repositories
    "dariobrombal", // it's a client's developer, when the project is over we should remove him from the organization
  ];

  async getOrganizationUsers() {
    const response = await this.octokit.rest.orgs.listMembers({
      org: this.organization,
    });

    const jsonResponse = response.data;
    return githubUsersResponseSchema.parse(jsonResponse).filter((it) => {
      return !this.usernameBlackList.includes(it.login);
    });
  }

  async getOrganizationRepositories() {
    let repositories: GithubRepositories = [];
    let page = 1;
    let perPage = 100; // Maximum allowed per page

    while (true) {
      const response = await this.octokit.rest.repos.listForOrg({
        org: this.organization,
        page,
        per_page: perPage,
      });

      const parsedResponse = githubRepositoriesResponseSchema.parse(
        response.data,
      );

      if (parsedResponse.length === 0) {
        break;
      }

      repositories = repositories.concat(parsedResponse);
      page++;
    }

    return repositories;
  }

  // TODO we may be better off by fetching user stats https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28
  async getRepositoryCommits(repository: string) {
    let commits: GithubCommits[] = [];
    let page = 1;
    let perPage = 100; // Maximum allowed per page

    while (true) {
      const response = await this.octokit.rest.repos.listCommits({
        page,
        per_page: perPage,
        owner: this.organization,
        repo: repository,
      });

      const parsedResponse = githubCommitsResponseSchema.parse(response.data);

      if (parsedResponse.length === 0) {
        break;
      }

      commits = commits.concat(parsedResponse);
      page++;
    }

    return commits;
  }
}

export const githubApiClient = new GithubApiClient(
  serverEnv.githubOrganization,
  serverEnv.githubPersistentToken,
);
