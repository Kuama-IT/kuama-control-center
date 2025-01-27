"use client";

import { UploadButton } from "@/modules/uploadthing/utils";
import { startTransition } from "react";
import { kProjectsServer } from "@/modules/k-projects/k-projects-server";
import { useRouter } from "next/navigation";

export const AddImageToProject = ({ projectId }: { projectId: number }) => {
  const router = useRouter();
  const onUploadCompletedAction = () => {
    router.refresh();
  };
  return (
    <UploadButton
      content={{ button: "Add Images" }}
      endpoint="imageUploader"
      input={{ projectId }}
      onClientUploadComplete={onUploadCompletedAction}
      onUploadError={(error: Error) => {
        // TODO Do something with the error.
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};
