"use client";

import { useTransition } from "react";
import { handledSyncEmployeePayrolls } from "../actions/payrolls.actions";
import { Button } from "@/components/ui/button";

export const PubblicaFolderDownloadEmployeePayslips = ({
  year,
}: {
  year: string;
}) => {
  // use transition for better UX
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(() => {
      handledSyncEmployeePayrolls({ year });
    });
  };

  return (
    <Button onClick={() => handleSubmit()}>
      {isPending ? "Downloading..." : "Download Payslips"}
    </Button>
  );
};
