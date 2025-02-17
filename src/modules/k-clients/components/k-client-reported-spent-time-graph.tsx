import { kClientsServer } from "@/modules/k-clients/k-clients-server";
import { FillParentAreaChart } from "@/modules/graphs/components/fill-parent-area-chart";
import { isFailure } from "@/utils/server-action-utils";
import { ErrorMessage } from "@/modules/ui/components/error-message";

export default async function KClientReportedSpentTimeGraph({
  clientId,
}: {
  clientId: number;
}) {
  const graphData = await kClientsServer.getMonthlySpentTimes(clientId);
  if (isFailure(graphData)) {
    return <ErrorMessage failure={graphData} />;
  }
  return (
    <FillParentAreaChart
      data={graphData}
      margin={{
        bottom: 0,
        left: 0,
        top: 150,
        right: 0,
      }}
      fill={"#312c85"}
      stroke={"#312c85"}
    />
  );
}
