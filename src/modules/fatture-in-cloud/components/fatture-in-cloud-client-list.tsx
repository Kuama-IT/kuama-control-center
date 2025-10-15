import { Client } from "@fattureincloud/fattureincloud-ts-sdk";
import { FattureInCloudClientCard } from "./fatture-in-cloud-client-card";

export const FattureInCloudClientList = ({
    clients,
}: {
    clients: Client[];
}) => {
    return (
        <div>
            <h2 className="bold uppercase py-2 border-b-blue-200 mb-4 border-b-2">
                Client List ({clients.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {clients.map((client) => (
                    <FattureInCloudClientCard key={client.id} client={client} />
                ))}
            </div>
        </div>
    );
};
