"use server";
// Given how we currently work, the best solution is start from YT.
// 1. fetch YT users
// 2. for each user fetch their timesheets
// 3. for each timesheet fetch their tasks, and try to retrieve code stats
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { syncYouTrackUser } from "@/modules/sync-data/sync-youtrack-user";
import { syncYouTrackProjects } from "@/modules/sync-data/sync-youtrack-projects";
import { syncYouTrackOrganizations } from "@/modules/sync-data/sync-youtrack-organizations";
import { syncYoutrackUsers } from "@/modules/sync-data/sync-youtrack-users";

export const syncData = async () => {
  const organizations = await youtrackApiClient.getOrganizations();

  const projectsOrganizationMap =
    await syncYouTrackOrganizations(organizations);

  const projects = await syncYouTrackProjects(projectsOrganizationMap);

  const users = await syncYoutrackUsers();

  for (const user of users) {
    if (!user.email) {
      console.log("skipping user", user);
      continue;
    }

    await syncYouTrackUser(user, projects);
  }

  // we have time spent, we have tasks, we have projects, we have organizations, we have employees

  // TODO - sync employees information
  // TODO - sync clients information
  // TODO - sync code stats
};
