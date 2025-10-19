import { format } from "date-fns";
import {
    type DipendentiInCloudReportProps,
    getDataForReport,
    getItalianDayLetter,
    getReportTitle,
    type MonthDayItem,
    type ReportRow,
    type UIDay,
} from "../dipendenti-in-cloud-report-utils";

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
        <div className="m-16 min-w-max text-sm print:m-0 print:text-[10px]">
            <ReportTitle date={props.from} />

            <table className="w-full border-collapse text-black">
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
    <div className="flex justify-center border-black border-t border-r border-l py-2 font-bold uppercase">
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
    <div className="flex border-black border-t uppercase">
        {/* employee name */}
        <div
            className={`${employeeCellClass} border-black border-r py-2`}
        ></div>

        {/* absence reason */}
        <div className={`${dayCellClass} border-black border-r py-2`}></div>

        {/* days */}
        {month.map((day) => {
            return (
                <div
                    key={`report-header-${day.formattedDate}`}
                    className={`flex flex-col items-center ${dayCellClass} border-black border-r text-xs print:text-[10px]`}
                >
                    <span>{getItalianDayLetter(day.date)}</span>
                    <span>{format(day.date, "d")}</span>
                </div>
            );
        })}
        <div className="flex flex-1 items-center justify-center border-black border-r print:text-[10px]">
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
            <tr className="t-body break-inside-avoid" key={item.id}>
                <td className="border border-black">
                    <div className="flex uppercase print:text-[10px]">
                        <div
                            className={`${employeeCellClass} flex items-center justify-center border-black border-r py-2 text-center`}
                        >
                            <div className="flex flex-col gap-1 print:text-[10px]">
                                {item.employeeName}
                                <pre className="text-[10px]">
                                    {item.employeeNationalInsuranceNumber}
                                </pre>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col">
                            {item.reasons.map(({ code, days }, reasonIndex) => (
                                <div
                                    className={`flex ${reasonIndex > 0 ? "border-black border-t" : ""}`}
                                    key={`${index}-${reasonIndex}-${code}`}
                                >
                                    <div
                                        className={`${dayCellClass} flex items-center justify-center border-black border-r py-2`}
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

                            <div className={`flex border-black border-t`}>
                                <div
                                    className={`${dayCellClass} border-black border-r py-2`}
                                />
                                {item.totals.map((day, itemTotalIndex) => (
                                    <ReportDayCell
                                        day={day}
                                        dayCellClass={dayCellClass}
                                        key={`t-${index}-${itemTotalIndex}-${day.formattedDate}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-1 items-center justify-center border-black border-r text-end">
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
            className={`flex flex-col items-center justify-center ${dayCellClass} border-black border-r py-2 text-xs print:text-[10px]`}
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
        <div
            className={`${extraClasses} ${dayCellClass} border-black border-r`}
        />
    );
};

const ReportLegend = ({
    reasons,
}: {
    reasons: { code: string; name: string }[];
}) => {
    return (
        <div className="flex flex-col text-sm">
            <div className="py-2 font-bold uppercase">Legenda</div>

            {reasons.map((reason) => (
                <div
                    key={reason.code}
                    className="flex items-center gap-1 text-xs"
                >
                    <span className="w-12 font-bold">{reason.code}</span>
                    <span>{reason.name}</span>
                </div>
            ))}
        </div>
    );
};
