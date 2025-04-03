import {
  DipendentiInCloudReportProps,
  getDataForReport,
  getItalianDayLetter,
  getReportTitle,
  MonthDayItem,
  ReportRow,
  UIDay,
} from "../dipendenti-in-cloud-report-utils";
import { format } from "date-fns";

/**
 * DipendentiInCloudReport
 * A component to build a monthly report of worked hours/not worked hours
 * to our payroll office.
 * @constructor
 */
export default function DipendentiInCloudReport(
  props: DipendentiInCloudReportProps,
) {
  const { rows, month } = getDataForReport(props);

  const employeeCellClass =
    "w-[200px] min-w-[200px] print:w-[100px] print:min-w-[100px]";
  const dayCellClass =
    "w-[40px] max-w-[40px] print:w-[30px] print:max-w-[30px]";
  return (
    <div className="m-16 print:m-0 text-sm min-w-max print:text-[10px]">
      <ReportTitle date={props.from} />

      <table className="text-black w-full border-collapse">
        <thead className="table-header-group">
          <tr>
            <th className="border border-black">
              <ReportPreHeader />
              <ReportHeader
                month={month}
                dayCellClass={dayCellClass}
                employeeCellClass={employeeCellClass}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <ReportBody
            rows={rows}
            dayCellClass={dayCellClass}
            employeeCellClass={employeeCellClass}
          />
        </tbody>
      </table>
      <ReportLegend reasons={props.absenceReasons} />
    </div>
  );
}

const ReportTitle = ({ date }: { date: Date }) => {
  return (
    <div className="text-end">
      Mese: <strong>{getReportTitle(date)}</strong>
    </div>
  );
};

const ReportPreHeader = () => (
  <div className="uppercase font-bold py-2 border-black border-t border-r border-l flex justify-center">
    Ore lavorate
  </div>
);

const ReportHeader = ({
  month,
  employeeCellClass,
  dayCellClass,
}: {
  month: MonthDayItem[];
  dayCellClass: string;
  employeeCellClass: string;
}) => (
  <div className="uppercase border-t border-black flex">
    {/* employee name */}
    <div className={`${employeeCellClass} py-2 border-r border-black`}></div>

    {/* absence reason */}
    <div className={`${dayCellClass} py-2 border-r border-black`}></div>

    {/* days */}
    {month.map((day, index) => {
      return (
        <div
          key={`report-header-${index}`}
          className={`flex flex-col items-center ${dayCellClass} border-r border-black text-xs print:text-[10px]`}
        >
          <span>{getItalianDayLetter(day.date)}</span>
          <span>{format(day.date, "d")}</span>
        </div>
      );
    })}
    <div className="flex items-center justify-center flex-1 border-r border-black print:text-[10px]">
      Totali
    </div>
  </div>
);

const ReportBody = ({
  rows,
  employeeCellClass,
  dayCellClass,
}: {
  rows: ReportRow[];
  employeeCellClass: string;
  dayCellClass: string;
}) => {
  return rows.map((item, index) => {
    return (
      <tr className="t-body break-inside-avoid" key={index}>
        <td className="border border-black">
          <div className="uppercase flex print:text-[10px]">
            <div
              className={`${employeeCellClass} py-2 border-r border-black flex items-center justify-center text-center`}
            >
              <div className="flex flex-col gap-1 print:text-[10px]">
                {item.employeeName}
                <pre className="text-[10px]">
                  {item.employeeNationalInsuranceNumber}
                </pre>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              {item.reasons.map(({ code, days }, reasonIndex) => (
                <div
                  className={`flex ${reasonIndex > 0 ? "border-t border-black" : ""}`}
                  key={`${index}-${reasonIndex}-${code}`}
                >
                  <div
                    className={`${dayCellClass} py-2 border-r border-black flex items-center justify-center`}
                  >
                    {code}
                  </div>

                  {days.map((day, dayIndex) => (
                    <ReportDayCell
                      day={day}
                      dayCellClass={dayCellClass}
                      key={`r-${index}-${reasonIndex}-${dayIndex}-${day.formattedDate}`}
                    />
                  ))}
                </div>
              ))}

              <div className={`flex border-t border-black`}>
                <div className={`${dayCellClass} py-2 border-r border-black`} />
                {item.totals.map((day, itemTotalIndex) => (
                  <ReportDayCell
                    day={day}
                    dayCellClass={dayCellClass}
                    key={`t-${index}-${itemTotalIndex}-${day.formattedDate}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1 text-end items-center flex justify-center border-r border-black">
              {item.monthlyTotalLabel}
            </div>
          </div>
        </td>
      </tr>
    );
  });
};

const ReportDayCell = ({
  day,
  dayCellClass,
}: {
  day: UIDay;
  dayCellClass: string;
}) => {
  if (day.isClosureOrWeekend) {
    return <NotWorkingDayCell day={day} dayCellClass={dayCellClass} />;
  }

  return (
    <div
      className={`flex flex-col justify-center items-center ${dayCellClass} border-r border-black text-xs print:text-[10px] py-2`}
    >
      {day.label}
    </div>
  );
};

const NotWorkingDayCell = ({
  day,
  dayCellClass,
}: {
  day: MonthDayItem;
  dayCellClass: string;
}) => {
  const extraClasses = day.isSunday
    ? "bg-gray-300"
    : day.isSaturday
      ? "bg-gray-200"
      : "bg-gray-100";
  return (
    <div className={`${extraClasses} ${dayCellClass} border-r border-black`} />
  );
};

const ReportLegend = ({
  reasons,
}: {
  reasons: { code: string; name: string }[];
}) => {
  return (
    <div className="flex flex-col text-sm">
      <div className="uppercase font-bold py-2">Legenda</div>

      {reasons.map((reason) => (
        <div key={reason.code} className="flex gap-1 items-center text-xs">
          <span className="w-12 font-bold">{reason.code}</span>
          <span>{reason.name}</span>
        </div>
      ))}
    </div>
  );
};
