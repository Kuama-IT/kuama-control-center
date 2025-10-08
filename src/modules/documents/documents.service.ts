import { db } from "@/drizzle/drizzle-db";
import { documents } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";

type CreateDocumentOptions = {
  mime: string;
  fileName?: string;
  extension?: string;
};

export const documentsService = {
  async createFromArrayBuffer(
    arrayBuffer: ArrayBuffer,
    options: CreateDocumentOptions
  ) {
    const content = Buffer.from(new Uint8Array(arrayBuffer));
    return this.createFromBuffer(content, options);
  },

  async createFromBuffer(content: Buffer, options: CreateDocumentOptions) {
    const sha256 = createHash("sha256").update(content).digest("hex");

    // Check if document already exists by sha256
    const existing = await db
      .select()
      .from(documents)
      .where(eq(documents.sha256, sha256))
      .limit(1);
    if (existing.length) return existing[0];

    const res = await db
      .insert(documents)
      .values({
        content,
        sizeInBytes: content.byteLength,
        sha256,
        mime: options.mime,
        fileName: options.fileName,
        extension:
          options.extension ?? options.fileName?.split(".").pop() ?? undefined,
      })
      .returning();

    return res[0];
  },
};
