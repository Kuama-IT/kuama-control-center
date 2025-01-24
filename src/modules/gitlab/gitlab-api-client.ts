import { Gitlab } from "@gitbeaker/rest";

class GitlabApiClient {
  private readonly api: InstanceType<typeof Gitlab<false>>;
  constructor(
    public readonly endpoint: string,
    persistentToken: string,
  ) {
    this.api = new Gitlab({
      token: persistentToken,
    });
  }

  async getProjects() {
    return this.api.Projects.all();
  }

  async getCommits(projectId: number) {
    // fetch all commits
    return this.api.Commits.all(projectId, { all: true });
  }
}
