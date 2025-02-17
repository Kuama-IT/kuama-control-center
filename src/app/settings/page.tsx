import { Title } from "@/modules/ui/components/title";
import { IoMdSettings } from "react-icons/io";
import { SyncButton } from "@/modules/settings/components/sync-button";
import type { Metadata } from "next";
import SyncDipendentiInCloud from "@/modules/settings/components/sync-dipendenti-in-cloud";
import SyncFattureInCloud from "@/modules/settings/components/sync-fatture-in-cloud";

export const metadata: Metadata = {
  title: "Settings | K1 App",
  description: "Settings | Kuama Control Center",
};

export default async function Page() {
  return (
    <div className="px-8 pt-8 flex flex-col gap-8">
      <Title icon={<IoMdSettings />}>Settings</Title>
      <div className="grid grid-cols-4 gap-4">
        <SyncDipendentiInCloud />
        <SyncButton />
        <div></div>
        <div></div>
        <SyncFattureInCloud />
      </div>
    </div>
  );
}
