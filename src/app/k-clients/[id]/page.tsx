import KClientDetail from "@/modules/k-clients/components/k-client-detail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div>
      <KClientDetail id={id} />
    </div>
  );
}
