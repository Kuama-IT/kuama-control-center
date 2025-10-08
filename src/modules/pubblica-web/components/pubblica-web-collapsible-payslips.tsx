"use client";
import { useState } from "react";
import { PubblicaWebCollapsiblePayslipList } from "./pubblica-web-collapsible-payslip-list";

export function PubblicaWebCollapsiblePayslips({
  payslips,
}: {
  payslips: {
    id: number;
    createdAt: Date;
    net: number;
    gross: number;
    month: number;
    year: number;
    fullName: string;
    birthDate: string | null;
  }[];
}) {
  const [open, setOpen] = useState(false);
  // Group payslips by employee name
  const payslipsByEmployee: Record<string, typeof payslips> = {};
  for (const payslip of payslips) {
    if (!payslipsByEmployee[payslip.fullName]) {
      payslipsByEmployee[payslip.fullName] = [];
    }
    payslipsByEmployee[payslip.fullName].push(payslip);
  }
  return (
    <div className="col-span-2">
      <button
        type="button"
        className="flex items-center gap-2 font-semibold focus:outline-none transition-colors hover:text-blue-600 mb-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="payslips-list"
      >
        <span
          className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
        >
          ▶
        </span>
        Payslips
        <span className="text-xs text-gray-500 ml-2">({payslips.length})</span>
      </button>
      <ul
        id="payslips-list"
        className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{ transitionProperty: "max-height, opacity" }}
      >
        {Object.entries(payslipsByEmployee).map(
          ([employeeName, payslips], idx) => (
            <PubblicaWebCollapsiblePayslipList
              key={idx}
              employeeName={employeeName}
              payslips={payslips}
            />
          ),
        )}
      </ul>
    </div>
  );
}
