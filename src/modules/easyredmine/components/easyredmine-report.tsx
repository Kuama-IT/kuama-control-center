import { kPlatformCredentialsServer } from "@/modules/k-platform-credentials/k-platform-credentials-server";
import easyRedmineGetSpentTimes from "@/modules/easyredmine/actions/easyredmine-get-spent-times";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function EasyredmineReport({
  credentialsId,
}: {
  credentialsId: string;
}) {
  const credentials = await kPlatformCredentialsServer.byId(
    Number(credentialsId),
  );
  if (!credentials) {
    return <pre>Credentials not found</pre>;
  }

  if (credentials.platform !== "easyredmine") {
    return <pre>Invalid platform</pre>;
  }

  const { timesSpent: spentTimes, monthTotalHours } =
    await easyRedmineGetSpentTimes(credentials);

  return (
    <Table>
      <TableCaption className="caption-top">
        {spentTimes[0].userFullName} Spent time for current month
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Task</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Spent time</TableHead>
          <TableHead>Azienda</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <b>Total</b>
          </TableCell>
          <TableCell>
            <b>{monthTotalHours.toFixed(2)}</b>
          </TableCell>
          <TableCell></TableCell>
        </TableRow>
        {spentTimes.map((spentTime) => (
          <TableRow key={spentTime.id}>
            <TableCell>
              <Link
                href={`${credentials.endpoint}projects/${spentTime.project?.id}`}
              >
                {spentTime.project?.code} - <br />
                {spentTime.project?.name}
              </Link>
            </TableCell>
            <TableCell>
              <Link
                href={`${credentials.endpoint}issues/${spentTime.task?.id}`}
              >
                {spentTime.task?.subject}
              </Link>
            </TableCell>
            <TableCell>
              <div className="whitespace-nowrap">{spentTime.date}</div>
            </TableCell>
            <TableCell>
              <div className="whitespace-nowrap">{spentTime.userFullName}</div>
            </TableCell>
            <TableCell>{spentTime.activity}</TableCell>
            <TableCell>{parseFloat(spentTime.spentTime).toFixed(2)}</TableCell>
            <TableCell>{spentTime.agency}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
