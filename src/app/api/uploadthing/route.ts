import { createRouteHandler } from "uploadthing/next";
import { fileRouter } from "@/modules/uploadthing/core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: fileRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});
