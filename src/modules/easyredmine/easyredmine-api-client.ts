import { Api } from "@/modules/easyredmine/generated/easyredmine-rest-client";

export class EasyRedmineApiClient {
  private readonly api: Api<{ headers: { "X-Redmine-API-Key": string } }>;
  constructor(
    public readonly endpoint: string,
    public readonly token: string,
  ) {
    this.api = new Api({
      baseUrl: endpoint,
      securityWorker: () => ({
        headers: {
          "X-Redmine-API-Key": token,
        },
      }),
    });
  }

  async getSpentTimes() {
    // TODO fetch times
    const res = await this.api.timeEntriesFormat.timeEntriesDetail("json", {
      // set_filter: true,
      // easy_query_q: "spent_on><2025-01-01|2025-01-31",
    });
    const projects = res.data.time_entries?.map((entry) => entry.project) ?? [];
    const users = res.data.time_entries?.map((entry) => entry.user) ?? [];
    const issues = res.data.time_entries?.map((entry) => entry.issue) ?? [];

    console.log(issues);
    const uniqueIssuesIds: number[] = [];
    for (const issue of issues) {
      if (
        issue &&
        issue.id !== undefined &&
        !uniqueIssuesIds.includes(issue.id)
      ) {
        uniqueIssuesIds.push(issue.id);
      }
    }

    console.log(uniqueIssuesIds);
    // console.log(projects);
  }
}
