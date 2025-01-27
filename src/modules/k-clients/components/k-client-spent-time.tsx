import { kClientsServer } from "@/modules/k-clients/k-clients-server";

export default async function KClientSpentTime({
  date,
  projects,
}: {
  date: Date;
  projects: number[];
}) {
  try {
    const { humanReadableDuration } =
      await kClientsServer.getTasksAndSpentTimes(projects, date);

    return <div>{humanReadableDuration}</div>;
  } catch (e) {
    return <div>error</div>;
  }
}
