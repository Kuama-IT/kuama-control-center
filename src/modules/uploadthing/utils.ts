import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { FileRouter } from "@/modules/uploadthing/core";

export const UploadButton = generateUploadButton<FileRouter>();
export const UploadDropzone = generateUploadDropzone<FileRouter>();
