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
import { format } from "date-fns";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function EasyredmineReport({
  credentialsId,
  from,
  to,
}: {
  credentialsId: string;
  from: Date;
  to: Date;
}) {
  const credentials = await kPlatformCredentialsServer.byId(
    Number(credentialsId),
  );
  if (isFailure(credentials)) {
    return <ErrorMessage failure={credentials} />;
  }

  if (credentials.platform !== "easyredmine") {
    return (
      <ErrorMessage
        failure={{
          type: "__failure__",
          code: "__invalid_params__",
          message: "Invalid platform provided",
        }}
      />
    );
  }

  const res = await easyRedmineGetSpentTimes({
    credentials,
    range: {
      from,
      to,
    },
  });
  if (isFailure(res)) {
    return <ErrorMessage failure={res} />;
  }
  const { timesSpent: spentTimes, monthTotalHours } = res;
  const monthName = format(spentTimes[0].date, "MMMM");
  const userFullName = spentTimes[0].userFullName;
  const agency = spentTimes[0].agency;

  return (
    <div className="m-8">
      <Table>
        <TableCaption className="caption-top">
          {agency} - {userFullName} - Spent time for {monthName}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Spent time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={4}>
              <b>Total</b>
            </TableCell>
            <TableCell colSpan={2} className="text-right">
              <b>{monthTotalHours.toFixed(2)} h</b>
            </TableCell>
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
                <div className="whitespace-nowrap">
                  {format(spentTime.date, "dd/MM/yyyy")}
                </div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap">
                  {spentTime.userFullName}
                </div>
              </TableCell>
              <TableCell>{spentTime.activity}</TableCell>
              <TableCell>
                {parseFloat(spentTime.spentTime).toFixed(2)} h
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
