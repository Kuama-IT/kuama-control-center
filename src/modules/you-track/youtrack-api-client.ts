import { serverEnv } from "@/env/server-env";
import {
  OrganizationListResponse,
  organizationListResponseSchema,
  projectListResponseSchema,
  projectTeamUserListResponseSchema,
  projectWithTeamUsersListResponseSchema,
  ProjectWithUsersListResponse,
  rawReducedUserListResponseSchema,
  ReducedUser,
  reducedUserListResponseSchema,
  sourcedProjectRolesListResponseSchema,
  WorkTimeListResponse,
  workTimeListResponseSchema,
} from "@/modules/you-track/schemas/youtrack-schemas";

class YoutrackApiClient {
  private static readonly workItemFields: string =
    "id,date,duration(presentation,minutes),type(name),issue(project(ringId),id,idReadable,summary)";

  private static readonly projectFields: string =
    "$type,archived,ringId,id,leader($type,id,login,ringId),name,shortName,iconUrl,team(id,ringId)";

  private static readonly organizationFields: string = `id,ringId,name,description,iconUrl,projects(${YoutrackApiClient.projectFields}),projectsCount`;

  private static readonly sourcedProjectRolesFields: string = `id,role(id,name,key),project(id,name,global)&top=-1`;

  private static readonly userFields: string =
    "id,login,email,fullName,ringId,avatarUrl,banned";

  private static readonly loginsToIgnore = [
    "giomorris",
    "guest",
    "andrea.svegliado",
  ];

  private static readonly adminLogins = ["Dan", "marco.marti"];

  constructor(
    public readonly endpoint: string,
    public readonly token: string,
  ) {}

  private get baseEndpoint() {
    return `${this.endpoint}youtrack`;
  }

  private get hubEndpoint() {
    return `${this.endpoint}hub`;
  }

  async getWorkItems(
    email: string,
    startDate: string | undefined = undefined, // YYYY-MM-DD
    endDate: string | undefined = undefined, // YYYY-MM-DD
  ): Promise<undefined | WorkTimeListResponse> {
    const users = await this.getUsers();

    const user = users.find((it) => it.email === email);

    if (!user) {
      return;
    }
    const params = ["$top=-1"];
    if (startDate) {
      params.push(`startDate=${startDate}`);
    }

    if (endDate) {
      params.push(`endDate=${endDate}`);
    }

    params.push(`author=${user.login}`);
    params.push(`fields=${YoutrackApiClient.workItemFields}`);

    // sadly, the client does not support asking for issue's work field
    const workItemsJson = await this.fetchWithAuth(
      `${this.baseEndpoint}/api/workItems?${params.join("&")}`,
    );
    return workTimeListResponseSchema.parse(workItemsJson);
  }

  async getUsers(): Promise<ReducedUser[]> {
    const usersJson = await this.fetchWithAuth(
      `${this.baseEndpoint}/api/users?fields=${YoutrackApiClient.userFields}&$top=-1`,
    );
    const allUsers = rawReducedUserListResponseSchema.parse(usersJson);

    const activeUsers = allUsers.filter(
      ({ banned, login }) =>
        !banned && !YoutrackApiClient.loginsToIgnore.includes(login),
    );

    const inactiveUsers = allUsers.filter(
      ({ banned, login }) =>
        banned && !YoutrackApiClient.loginsToIgnore.includes(login),
    );

    const activeUsersWithRelatedUsers = activeUsers.map((user) => {
      const relatedUserIds = inactiveUsers
        .filter((it) => {
          return it.fullName === user.fullName;
        })
        .map(({ id }) => id);

      return {
        ...user,
        relatedUserIds,
      };
    });

    return reducedUserListResponseSchema.parse(activeUsersWithRelatedUsers);
  }

  async getProjects(): Promise<ProjectWithUsersListResponse> {
    // again, the client will not return us all the data we need
    const projectsJson = await this.fetchWithAuth(
      `${this.baseEndpoint}/api/admin/projects?fields=${YoutrackApiClient.projectFields}&$top=-1`,
    );

    const projects = projectListResponseSchema.parse(projectsJson);

    const projectsWithUsersRaw = await Promise.all(
      projects.map(async (p) => {
        const teamJson = await this.fetchWithAuth(
          `${this.hubEndpoint}/api/rest/projectteams/${p.team.ringId}/users`,
        );

        const { users: projectTeam } =
          projectTeamUserListResponseSchema.parse(teamJson);

        return {
          ...p,
          team: {
            ...p.team,
            users: projectTeam.filter(
              (it) => !YoutrackApiClient.adminLogins.includes(it.login),
            ),
          },
        };
      }),
    );

    const projectsWithUsers =
      projectWithTeamUsersListResponseSchema.parse(projectsWithUsersRaw);

    return projectsWithUsers.filter((it) => !it.archived);
  }

  async getOrganizations(): Promise<OrganizationListResponse> {
    const organizationJson = await this.fetchWithAuth(
      `${this.baseEndpoint}/api/admin/organizations?fields=${YoutrackApiClient.organizationFields}&$top=-1`,
    );

    return organizationListResponseSchema.parse(organizationJson);
  }

  async checkIsAdmin(email: string | null | undefined): Promise<boolean> {
    if (!email) {
      return false;
    }
    const users = await this.getUsers();
    const user = users.find((u) => u.email === email);
    if (!user || !user.ringId) {
      return false;
    }

    const url = `${this.hubEndpoint}/api/rest/users/${user.ringId}/sourcedprojectroles?fields=${YoutrackApiClient.sourcedProjectRolesFields}`;

    const sourcedProjectRolesJson = await this.fetchWithAuth(url);

    const { sourcedprojectroles: sourcedProjectRoles } =
      sourcedProjectRolesListResponseSchema.parse(sourcedProjectRolesJson);

    const globalSourcedProjectRoles = sourcedProjectRoles.filter(
      (it) => it.project.global,
    );

    return (
      globalSourcedProjectRoles.find((it) => it.role.key === "system-admin") !==
      undefined
    );
  }

  private async fetchWithAuth(endpoint: string): Promise<unknown> {
    const request = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (!request.ok) {
      console.log(await request.text());
      throw new Error(`Failed to fetch ${endpoint}`);
    }

    try {
      return await request.json();
    } catch (e) {
      throw new Error(`Failed to parse ${endpoint} response`);
    }
  }
}

export const youtrackApiClient = new YoutrackApiClient(
  serverEnv.youtrackApiEndpoint,
  serverEnv.youtrackPersistentToken,
);
