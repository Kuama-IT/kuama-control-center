import { z } from "zod";

export const pubblicaWebAuthenticationResponseSchema = z.object({
  Message: z.string(),
  AuthToken: z.string(),
  Break: z.boolean(),
  Value: z.null(),
  HttpStatusCode: z.number(),
  Redirect: z.boolean(),
  Expired: z.boolean(),
  AllowRefresh: z.boolean(),
  OtpRequired: z.boolean(),
});

export type PubblicaWebAuthenticationResponse = z.infer<
  typeof pubblicaWebAuthenticationResponseSchema
>;

export const repositorySchema = z.object({
  Id: z.number(),
  Label: z.string(),
  MailNotification: z.boolean(),
  CanUpload: z.boolean(),
  OrderIndex: z.number(),
});
export type Repository = z.infer<typeof repositorySchema>;

export const repositoriesResponseSchema = z.array(repositorySchema);
export type RepositoriesResponse = z.infer<typeof repositoriesResponseSchema>;

export const folderTreeItemSchema = z.object({
  children: z.boolean(),
  text: z.string(),
  data: z.object({
    path: z.string(),
  }),
  unread: z.number(),
});
export type FolderTreeItem = z.infer<typeof folderTreeItemSchema>;

export const folderTreeResponseSchema = z.array(folderTreeItemSchema);
export type FolderTreeResponse = z.infer<typeof folderTreeResponseSchema>;

export const documentSchema = z.object({
  Id: z.number(),
  Name: z.string(),
  RelativePath: z.string(),
  ParentLabel: z.string(),
  ArchiviationDate: z.string().nullable(),
  CreationDate: z.string().nullable(),
  ModifyDate: z.string().nullable(),
  PublicationDate: z.string(),
  ReadingDate: z.string().nullable(),
  PasswordProtected: z.boolean(),
  MimeType: z.string(),
  Period: z.string(),
  State: z.number(),
  StateDescription: z.string(),
  Tags: z.string(),
  Version: z.string().nullable(),
  S3Document: z.boolean(),
});

export type Document = z.infer<typeof documentSchema>;

export const documentsResponseSchema = z.array(documentSchema);
