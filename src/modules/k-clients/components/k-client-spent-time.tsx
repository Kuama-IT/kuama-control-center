import { kClientsServer } from "@/modules/k-clients/k-clients-server";

export default async function KClientSpentTime({
  date,
  projects,
  className,
}: {
  date: Date;
  projects: number[];
  className?: string;
}) {
  try {
    const { humanReadableDuration } =
      await kClientsServer.getTasksAndSpentTimes(projects, date);

    return <div className={className}>{humanReadableDuration}</div>;
  } catch (e) {
    return <div>error</div>;
  }
}
