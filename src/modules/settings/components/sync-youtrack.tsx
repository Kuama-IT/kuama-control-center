import { Title } from "@/modules/ui/components/title";
import { YtSettings } from "@/modules/you-track/components/yt-settings";

export const SyncYoutrack = () => {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-8">
      <Title>YouTrack</Title>
      <YtSettings />
    </div>
  );
};
