import { YtImportOrganizationsButton } from "@/modules/you-track/components/yt-import-organizations-button";
import { YtImportProjectsButton } from "@/modules/you-track/components/yt-import-projects-button";
import { YtSyncUsersButton } from "@/modules/you-track/components/yt-sync-users-button";
import { YtImportTeamsButton } from "@/modules/you-track/components/yt-import-teams-button";

export const YtSettings = () => {
  return (
    <div className="flex flex-col gap-4">
      <YtImportOrganizationsButton />
      <YtImportProjectsButton />
      <YtSyncUsersButton />
      <YtImportTeamsButton />

      <pre>sync work items</pre>
    </div>
  );
};
