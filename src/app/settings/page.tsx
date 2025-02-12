import { Title } from "@/modules/ui/components/title";
import { IoMdSettings } from "react-icons/io";
import { SyncButton } from "@/modules/settings/components/sync-button";
import type { Metadata } from "next";
import { SyncPresenceSettings } from "@/modules/settings/components/sync-presence-settings";
import { SyncEmployees } from "@/modules/settings/components/sync-employees";

export const metadata: Metadata = {
  title: "Settings | K1 App",
  description: "Settings | Kuama Control Center",
};

export default async function Page() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <Title icon={<IoMdSettings />}>Settings</Title>
      <div className="grid grid-cols-2 gap/4">
        <SyncPresenceSettings />
        <SyncEmployees />
        <SyncButton />
      </div>
    </div>
  );
}
