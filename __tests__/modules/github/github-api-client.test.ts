import { describe, expect, test } from "vitest";

// N.B. This was written just to build the client, it is performing real calls and presumes a working env is present
describe("github api client", () => {
  // just to make vitest happy and keep this suite of tests for reference
  test("fake test", () => {
    expect(1).toBe(1);
  });

  // test("get all organization users", async () => {
  //   const organizationUsers = await githubApiClient.getOrganizationUsers();
  //   expect(organizationUsers.length).toBe(16);
  // });
  //
  // test("get all organization repositories", async () => {
  //   const organizationRepositories =
  //     await githubApiClient.getOrganizationRepositories();
  //
  //   console.log(`we have ${organizationRepositories.length} repositories`);
  //   expect(organizationRepositories.length).greaterThan(30);
  // });
  //
  // test("get all commits of a given repository", async () => {
  //   const repo = (await githubApiClient.getOrganizationRepositories())[0];
  //   const repositoryCommits = await githubApiClient.getRepositoryCommits(
  //     repo.name,
  //   );
  //
  //   console.log(repo.name, "has", repositoryCommits.length, "commits");
  //   expect(repositoryCommits.length).greaterThan(1);
  // });
});
