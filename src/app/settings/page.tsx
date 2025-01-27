import { Title } from "@/modules/ui/components/title";
import { IoMdSettings } from "react-icons/io";
import { SyncButton } from "@/modules/settings/components/sync-button";

export default async function Page() {
  return (
    <div>
      <Title icon={<IoMdSettings />}>Settings</Title>
      <SyncButton />
    </div>
  );
}
