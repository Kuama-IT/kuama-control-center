import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
} from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { it } from "date-fns/locale";

interface UserData {
  id: number;
  name: string;
  surname: string;
  cFisc: string;
  // Daily worked hours for each day of the month (the array length should match the number of days in the month)
  dailyHours: number[];
}

interface DipendentiInClountReportProps {
  credentialsId: string;
  // Month in numeric format 1-12
  month: number;
  // Year (e.g., 2025)
  year: number;
  // List of users with worked hours
  users: UserData[];
}

/**
 * Returns the letter corresponding to the day of the week in Italian:
 * 0 (Sunday)    => D
 * 1 (Monday)    => L
 * 2 (Tuesday)   => M
 * 3 (Wednesday) => M
 * 4 (Thursday)  => G
 * 5 (Friday)    => V
 * 6 (Saturday)  => S
 */
function getItalianDayLetter(date: Date): string {
  const dayIndex = getDay(date); // 0=Sunday, 1=Monday, ...
  switch (dayIndex) {
    case 0:
      return "D";
    case 1:
      return "L";
    case 2:
      return "M";
    case 3:
      return "M";
    case 4:
      return "G";
    case 5:
      return "V";
    case 6:
      return "S";
    default:
      return "";
  }
}

export default function DipendentiInClountReport({
  // TODO - REENABLE
  // credentialsId,
  month,
  year,
  users,
}: DipendentiInClountReportProps) {
  // TODO - REENABLE
  // const credentials = await kPlatformCredentialsServer.byId(Number(credentialsId));
  // if (isFailure(credentials)) {
  //   return <ErrorMessage failure={credentials} />;
  // }
  // if (!credentials) {
  //   return <pre>Credentials not found</pre>;
  // }

  // Calculate days in the month
  const currentDate = new Date(year, month - 1, 1);
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Format month and year label
  const monthYearLabel = format(currentDate, "MMMM yyyy", { locale: it });
  const monthYearLabelCapitalized =
    monthYearLabel.charAt(0).toUpperCase() + monthYearLabel.slice(1);

  return (
    <div className="m-16 space-y-4">
      <div className="w-full text-end">
        Month: <strong>{monthYearLabelCapitalized}</strong>
      </div>

      {/* Table with borders */}
      <Table className="border-collapse border border-gray-800">
        <TableCaption className="caption-top border-l border-t border-r border-gray-800">
          Ore lavorate
        </TableCaption>
        <TableHeader>
          {/* Row 1: Day letter */}
          <TableRow className="border-l border-b border-r border-gray-800">
            <TableHead className="whitespace-nowrap border border-gray-800">
              Nome / Cognome / C.Fisc
            </TableHead>
            {daysInMonth.map((day, index) => {
              const dayOfWeek = getDay(day);
              const extraClasses =
                dayOfWeek === 0
                  ? "bg-gray-300"
                  : dayOfWeek === 6
                    ? "bg-gray-200"
                    : "";
              return (
                <TableHead
                  key={index}
                  className={`${extraClasses} border border-gray-800`}
                >
                  {getItalianDayLetter(day)}
                </TableHead>
              );
            })}
            <TableHead className="border border-gray-800 text-end">
              Totali
            </TableHead>
          </TableRow>

          {/* Row 2: Day number */}
          <TableRow className="border border-gray-800">
            <TableHead className=" border border-gray-800" />
            {daysInMonth.map((day, index) => {
              const dayOfWeek = getDay(day);
              const extraClasses =
                dayOfWeek === 0
                  ? "bg-gray-300"
                  : dayOfWeek === 6
                    ? "bg-gray-200"
                    : "";
              return (
                <TableHead
                  key={index}
                  className={`${extraClasses} border border-gray-800`}
                >
                  {format(day, "d")}
                </TableHead>
              );
            })}
            <TableHead className="border border-gray-800" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const monthlyTotal = user.dailyHours.reduce(
              (acc, val) => acc + val,
              0
            );
            return (
              <TableRow key={user.id} className="border border-gray-800">
                <TableCell className="whitespace-nowrap border border-gray-800">
                  {user.name} {user.surname} <br />
                  {user.cFisc}
                </TableCell>
                {daysInMonth.map((day, dayIndex) => {
                  const dayOfWeek = getDay(day);
                  const extraClasses =
                    dayOfWeek === 0
                      ? "bg-gray-300"
                      : dayOfWeek === 6
                        ? "bg-gray-200"
                        : "";
                  return (
                    <TableCell
                      key={dayIndex}
                      className={`${extraClasses} border border-gray-800`}
                    >
                      {(user.dailyHours[dayIndex] ?? 0) === 0
                        ? ""
                        : user.dailyHours[dayIndex]}
                    </TableCell>
                  );
                })}
                <TableCell className="border border-gray-800 text-end">
                  {monthlyTotal}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
