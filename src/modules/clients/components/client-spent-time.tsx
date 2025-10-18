import { clientsServer } from "@/modules/clients/clients.server";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { isFailure } from "@/utils/server-action-utils";

export default async function ClientSpentTime({
    date,
    projectIds,
    className,
}: {
    date: Date;
    projectIds: number[];
    className?: string;
}) {
    try {
        const res = await clientsServer.getTasksAndSpentTimes({
            projectIds,
            date,
        });
        if (isFailure(res)) {
            return <ErrorMessage failure={res} />;
        }
        const { humanReadableDuration } = res;

        return <div className={className}>{humanReadableDuration}</div>;
    } catch (_e) {
        return <div>error</div>;
    }
}
