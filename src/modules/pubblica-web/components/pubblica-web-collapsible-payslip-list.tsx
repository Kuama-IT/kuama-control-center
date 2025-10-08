"use client";

import { useState } from "react";

export function PubblicaWebCollapsiblePayslipList({
  employeeName,
  payslips,
}: {
  employeeName: string;
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
  return (
    <li>
      <button
        type="button"
        className="flex items-center gap-2 font-semibold focus:outline-none transition-colors hover:text-blue-600"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`payrolls-list-${employeeName}`}
      >
        <span
          className={`transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}
        >
          ▶
        </span>
        {employeeName}
        <span className="text-xs text-gray-500 ml-2">({payslips.length})</span>
      </button>
      <ul
        id={`payrolls-list-${employeeName}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out" ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          transitionProperty: "max-height, opacity",
        }}
      >
        {payslips.map((payslip, idx) => (
          <li key={idx} className="pl-6 py-1 text-sm">
            {payslip.year}/{String(payslip.month).padStart(2, "0")} -{" "}
            {payslip.fullName} - Net: {payslip.net} € - Gross:{" "}
            {payslip.gross} € - Birthdate: {payslip.birthDate}
          </li>
        ))}
      </ul>
    </li>
  );
}
