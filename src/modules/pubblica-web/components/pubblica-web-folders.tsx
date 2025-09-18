import { isFailure } from "@/utils/server-action-utils";
import {
  handledGetPubblicaWebEmployeesCostOverMonthsGraphData,
  handledGetPubblicaWebGraphData,
  handledListRootFolders,
} from "../actions/payrolls.actions";
import { PubblicaFolderPayslipsActions } from "./pubblica-web-payslips-actions";
import { PubblicaWebCollapsiblePayslips } from "./pubblica-web-collapsible-payslips";
import { PubblicaWebPayslipsGraph } from "./pubblica-web-payslips-graph";
import { ErrorMessage } from "@/modules/ui/components/error-message";
import { PubblicaWebEmployeeCostBalanceGraph } from "./pubblica-web-employee-cost-balance-graph";
import { handledGetFattureInCloudEmittedInvoicesGraphData } from "@/modules/fatture-in-cloud/fatture-in-cloud.actions";

export default async function PubblicaWebFolders() {
  const folders = await handledListRootFolders();

  const graphData = await handledGetPubblicaWebGraphData();

  const balanceGraphData =
    await handledGetPubblicaWebEmployeesCostOverMonthsGraphData(
      new Date().getFullYear().toString()
    );

  const invoicesGraphData =
    await handledGetFattureInCloudEmittedInvoicesGraphData();

  if (isFailure(folders)) {
    return <ErrorMessage failure={folders} />;
  }

  if (isFailure(graphData)) {
    return <ErrorMessage failure={graphData} />;
  }

  if (isFailure(balanceGraphData)) {
    return <ErrorMessage failure={balanceGraphData} />;
  }

  if (isFailure(invoicesGraphData)) {
    return <ErrorMessage failure={invoicesGraphData} />;
  }

  return (
    <div>
      PubblicaWeb Folders
      <ul className="flex flex-col gap-4 mt-4 px-4">
        {folders.map((folder, index) => (
          <li key={index} className="flex-1 grid grid-cols-2 gap-2 shadow p-2">
            {folder.text}
            <div className="flex justify-end">
              <PubblicaFolderPayslipsActions year={folder.text} />
            </div>
            <div className="col-span-2">
              {folder.payrolls.length} payslips downloaded
              {folder.payrolls.length > 0 && (
                <>
                  from{" "}
                  <strong>
                    {folder.payrolls[folder.payrolls.length - 1].year}/
                    {String(
                      folder.payrolls[folder.payrolls.length - 1].month
                    ).padStart(2, "0")}
                  </strong>{" "}
                  to{" "}
                  <strong>
                    {folder.payrolls[0].year}/
                    {String(folder.payrolls[0].month).padStart(2, "0")}
                  </strong>{" "}
                  for a total (net) of{" "}
                  <strong>
                    {folder.payrolls
                      .map((it) => it.net)
                      .reduce((a, b) => a + b, 0)
                      .toFixed(2)}{" "}
                    €
                  </strong>
                </>
              )}
            </div>
            <div className="col-span-2 h-px bg-gray-200 my-2"></div>
            <ul className="col-span-2">
              <PubblicaWebCollapsiblePayslips payslips={folder.payrolls} />
            </ul>
          </li>
        ))}
      </ul>
      <div className="p-4">
        <PubblicaWebPayslipsGraph data={graphData} />
      </div>
      <div className="p-4">
        <PubblicaWebEmployeeCostBalanceGraph
          data={balanceGraphData}
          invoicesData={invoicesGraphData}
        />
      </div>
    </div>
  );
}
