import { YtImportProjectsButton } from "@/modules/you-track/components/yt-import-projects-button";
import { YtImportTeamsButton } from "@/modules/you-track/components/yt-import-teams-button";

export const YtSettings = () => {
    return (
        <div className="flex flex-col gap-4">
            <YtImportProjectsButton />
            <YtImportTeamsButton />
        </div>
    );
};
