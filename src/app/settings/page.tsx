import { Title } from "@/modules/ui/components/title";
import { IoMdSettings } from "react-icons/io";
import { SyncButton } from "@/modules/settings/components/sync-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | K1 App",
  description: "Settings | Kuama Control Center",
};

export default async function Page() {
  return (
    <div>
      <Title icon={<IoMdSettings />}>Settings</Title>
      <SyncButton />
    </div>
  );
}
