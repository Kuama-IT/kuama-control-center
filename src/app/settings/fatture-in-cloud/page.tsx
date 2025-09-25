import { FattureInCloudClientList } from "@/modules/fatture-in-cloud/components/fatture-in-cloud-client-list";
import { FattureInCloudSupplierList } from "@/modules/fatture-in-cloud/components/fatture-in-cloud-suppliers-list";
import {
  handledFattureInCloudClientsAll,
  handledFattureInCloudSuppliersAll,
} from "@/modules/fatture-in-cloud/fatture-in-cloud.actions";
import { BackButton } from "@/modules/ui/components/back-button";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { Title } from "@/modules/ui/components/title";
import { isFailure } from "@/utils/server-action-utils";
import { Metadata } from "next";
import { IoMdSettings } from "react-icons/io";

export const metadata: Metadata = {
  title: "Fatture In Cloud | Settings | K1 App",
  description: "Fatture In Cloud | Settings | Kuama Control Center",
};

export default async function Page() {
  const fattureInCloudClients = await handledFattureInCloudClientsAll();
  const fattureInCloudSuppliers = await handledFattureInCloudSuppliersAll();

  if (isFailure(fattureInCloudClients)) {
    return <ErrorMessage failure={fattureInCloudClients} />;
  }

  if (isFailure(fattureInCloudSuppliers)) {
    return <ErrorMessage failure={fattureInCloudSuppliers} />;
  }

  return (
    <div className="px-8 pt-8 flex flex-col gap-8">
      <div className="flex gap-4 items-center">
        <BackButton />
        <Title icon={<IoMdSettings />}>Gestione Fatture in Cloud </Title>
      </div>
      <div className="flex flex-col gap-4">
        <FattureInCloudClientList clients={fattureInCloudClients} />
        <FattureInCloudSupplierList suppliers={fattureInCloudSuppliers} />
      </div>
    </div>
  );
}
