import { describe, expect, test } from "vitest";
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";

// N.B. This was written just to build the client, it is performing real calls and presumes a working env is present
describe("youtrack api client", () => {
  // just to make vitest happy and keep this suite of tests for reference
  test("fake test", () => {
    expect(1).toBe(1);
  });

  // test("get workitems by user email", async () => {
  //   const workItems = await youtrackApiClient.getWorkItems("daniele@kuama.net");
  //   expect(workItems?.length).greaterThan(10);
  // });
  //
  test("get all youtrack users", async () => {
    const users = await youtrackApiClient.getUsers();
    console.log(users);
    expect(users.length).greaterThan(10);
  });
  //
  // test("get all youtrack projects", async () => {
  //   const projects = await youtrackApiClient.getProjects();
  //   expect(projects.length).greaterThan(5);
  // });
  //
  // test("get all youtrack organizations", async () => {
  //   const organizations = await youtrackApiClient.getOrganizations();
  //   expect(organizations.length).greaterThan(16);
  // });
  //
  // test("check if user is admin on youtrack", async () => {
  //   const isAdmin = await youtrackApiClient.checkIsAdmin("daniele@kuama.net");
  //   expect(isAdmin).toBe(true);
  // });
});
