import EasyredmineReport from "@/modules/easyredmine/components/easyredmine-report";

export default async function Page({
  params,
}: {
  params: Promise<{ credentialsId: string }>;
}) {
  const credentialsId = (await params).credentialsId;

  return <EasyredmineReport credentialsId={credentialsId} />;
}
