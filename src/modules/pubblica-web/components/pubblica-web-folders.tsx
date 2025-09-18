import { isFailure } from "@/utils/server-action-utils";
import { handledListRootFolders } from "../actions/payrolls.actions";
import { PubblicaFolderDownloadEmployeePayslips } from "./pubblica-web-download-employee-payslips";
import { PubblicaWebCollapsiblePayslips } from "./pubblica-web-collapsible-payslips";

export default async function PubblicaWebFolders() {
  const folders = await handledListRootFolders();

  if (isFailure(folders)) {
    return <div>Error: {folders.message}</div>;
  }

  return (
    <div>
      PubblicaWeb Folders
      <ul className="flex flex-col gap-4 mt-4 px-4">
        {folders.map((folder, index) => (
          <li key={index} className="flex-1 grid grid-cols-2 gap-2 shadow p-2">
            {folder.text}
            <div className="flex justify-end">
              <PubblicaFolderDownloadEmployeePayslips year={folder.text} />
            </div>
            <div className="col-span-2">
              {folder.payrolls.length} payslips downloaded
              {folder.payrolls.length > 0 && (
                <>
                  from{" "}
                  <strong>
                    {folder.payrolls[folder.payrolls.length - 1].year}/
                    {String(
                      folder.payrolls[folder.payrolls.length - 1].month,
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
    </div>
  );
}
