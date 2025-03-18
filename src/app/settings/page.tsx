import { Title } from "@/modules/ui/components/title";
import { IoMdSettings } from "react-icons/io";
import type { Metadata } from "next";
import SyncDipendentiInCloud from "@/modules/dipendenti-in-cloud/components/sync-dipendenti-in-cloud";
import SyncFattureInCloud from "@/modules/fatture-in-cloud/components/sync-fatture-in-cloud";
import { SyncYoutrack } from "@/modules/settings/components/sync-youtrack";
import SyncPubblicaWeb from "@/modules/pubblica-web/components/sync-pubblica-web";

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
        <SyncYoutrack />
        <SyncPubblicaWeb />

        <div className="col-span-4"></div>
        <div></div>
        <div></div>
        <SyncFattureInCloud />
      </div>
    </div>
  );
}
