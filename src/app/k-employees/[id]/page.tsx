import KEmployeeDetail from "@/modules/k-employees/components/k-employee-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div>
      <KEmployeeDetail id={id} />
    </div>
  );
}
