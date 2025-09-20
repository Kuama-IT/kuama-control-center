import { cashFlowService } from "@/modules/cash-flow/cash-flow.service";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const fileName = formData.get("fileName");
  if (!file || !(file instanceof Blob)) {
    return Response.json({ message: "File is required" }, { status: 400 });
  }
    if (!fileName || typeof fileName !== "string") {
    return Response.json({ message: "File name is required" }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // do not store the file if it's not correct format
  await cashFlowService.parseBankStatementXlsx(buffer);

  await cashFlowService.saveBankStatement(buffer, fileName);
  return Response.json({ message: "Done" }, { status: 200 });
}
