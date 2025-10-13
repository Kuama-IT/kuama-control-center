"use client";

import { PayslipRead } from "@/modules/payslips/schemas/payslip-read";
import { useState } from "react";

export function EmployeeDetailPayslips({
  payslips,
}: {
  payslips: PayslipRead[];
}) {
  const payslipsByYear = payslips.reduce(
    (acc, p) => {
      const year = p.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(p);
      return acc;
    },
    {} as Record<number, PayslipRead[]>,
  );

  const totalNet = payslips.reduce((sum, p) => sum + (p.net ?? 0), 0);
  const totalGross = payslips.reduce((sum, p) => sum + (p.gross ?? 0), 0);
  const totalWorkedDays = payslips.reduce(
    (sum, p) => sum + (p.workedDays ?? 0),
    0,
  );
  const totalWorkedHours = payslips.reduce(
    (sum, p) => sum + (p.workedHours ?? 0),
    0,
  );
  const avgNet = payslips.length ? totalNet / payslips.length : 0;
  const avgGross = payslips.length ? totalGross / payslips.length : 0;

  const [openYears, setOpenYears] = useState<number[]>([]);
  const toggleYear = (year: number) => {
    setOpenYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 font-mono">
        <div>
          <strong>Media Netta:</strong> €{avgNet.toFixed(2)}
        </div>
        <div>
          <strong>Media Lorda:</strong> €{avgGross.toFixed(2)}
        </div>
        <div>
          <strong>Totale giorni lavorati:</strong> {totalWorkedDays}
        </div>
        <div>
          <strong>Totale ore lavorate:</strong> {totalWorkedHours}
        </div>
      </div>
      <div className="space-y-2">
        {Object.entries(payslipsByYear)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([year, list]) => (
            <div key={year}>
              <button
                className="font-bold uppercase text-left w-full py-2 px-4 border-2 border-black bg-yellow-200 hover:bg-yellow-300 transition-colors"
                onClick={() => toggleYear(Number(year))}
              >
                {year} ({list.length} cedolini)
              </button>
              {openYears.includes(Number(year)) && (
                <div className="border-l-4 border-black pl-4 mt-2 space-y-2">
                  {list.map((p) => (
                    <div
                      key={p.id}
                      className="p-2 bg-white border-2 border-black shadow-sm font-mono text-xs"
                    >
                      <div>
                        <strong>Mese:</strong> {p.month}
                      </div>
                      <div>
                        <strong>Netto:</strong> €{p.net.toFixed(2)}
                      </div>
                      <div>
                        <strong>Lordo:</strong> €{p.gross.toFixed(2)}
                      </div>
                      <div>
                        <strong>Giorni lavorati:</strong> {p.workedDays}
                      </div>
                      <div>
                        <strong>Ore lavorate:</strong> {p.workedHours}
                      </div>
                      <div>
                        <strong>Permessi:</strong> {p.permissionsHoursBalance}
                      </div>
                      <div>
                        <strong>Ferie:</strong> {p.holidaysHoursBalance}
                      </div>
                      <div>
                        <strong>ROL:</strong> {p.rolHoursBalance}
                      </div>
                      <div>
                        <strong>Numero registrazione payroll:</strong>{" "}
                        {p.payrollRegistrationNumber}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
