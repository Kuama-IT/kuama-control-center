import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function KClientSpentTime({
  date,
  projectIds,
  className,
}: {
  date: Date;
  projectIds: number[];
  className?: string;
}) {
  try {
    const res = await kClientsServer.getTasksAndSpentTimes({
      projectIds,
      date,
    });
    if (isFailure(res)) {
      return <ErrorMessage failure={res} />;
    }
    const { humanReadableDuration } = res;

    return <div className={className}>{humanReadableDuration}</div>;
  } catch (e) {
    return <div>error</div>;
  }
}
