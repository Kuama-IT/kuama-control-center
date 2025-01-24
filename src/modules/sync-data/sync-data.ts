// Given how we currently work, the best solution is start from YT.
// 1. fetch YT users
// 2. for each user fetch their timesheets
// 3. for each timesheet fetch their tasks, and try to retrieve code stats
import { youtrackApiClient } from "@/modules/you-track/youtrack-api-client";
import { syncYouTrackUser } from "@/modules/sync-data/sync-youtrack-user";
import { syncYouTrackProjects } from "@/modules/sync-data/sync-youtrack-projects";

export const syncData = async () => {
  // fetch YT users
  const youTrackUsers = await youtrackApiClient.getUsers();
  // await syncYouTrackProjects();

  const organizations = await youtrackApiClient.getOrganizations();
  // Todo - sync organizations
  for (const user of youTrackUsers) {
    await syncYouTrackUser(user);
  }

  // for each user fetch their timesheets
  // for each timesheet fetch their tasks, and try to retrieve code stats
  // for each task fetch their commits
};
