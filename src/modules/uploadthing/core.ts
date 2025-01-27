import {
  createUploadthing,
  type FileRouter as UploadthingFileRouter,
} from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { kProjectsServer } from "@/modules/k-projects/k-projects-server";

const f = createUploadthing();

// const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .input(
      z.object({
        projectId: z.number(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files, input }) => {
      // TODO authorize
      // This code runs on your server before upload
      // const user = await auth(req);
      //
      // // If you throw, the user will not be able to upload
      // if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        projectId: input.projectId,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await kProjectsServer.addImages(metadata.projectId, [file.url]);
    }),
} satisfies UploadthingFileRouter;

export type FileRouter = typeof fileRouter;
