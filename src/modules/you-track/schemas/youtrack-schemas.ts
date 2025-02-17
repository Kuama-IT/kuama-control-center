import { z } from "zod";

export const projectTeamUserResponseSchema = z.object({
  id: z.string(),
  login: z.string(),
  banned: z.boolean(),
  teamOwnUser: z.boolean(),
  profile: z.object({
    avatar: z.object({
      url: z.string(), // this is the full avatar url
    }),
    email: z
      .object({
        email: z.string(),
      })
      .optional(),
  }),
});

export const projectTeamUserListResponseSchema = z.object({
  users: z.array(projectTeamUserResponseSchema),
});

export type ProjectTeamUserResponse = z.infer<
  typeof projectTeamUserResponseSchema
>;

export type ProjectTeamUserListResponse = z.infer<
  typeof projectTeamUserListResponseSchema
>;

const projectTeamResponseSchema = z.object({
  id: z.string(),
  ringId: z.string(),
});

const projectTeamWithUsersResponseSchema = projectTeamResponseSchema.extend({
  users: z.array(projectTeamUserResponseSchema).optional(), // we populate manually this prop by calling another endpoint (YouTrack api does not provide a field to request this information
});

export const projectResponseSchema = z.object({
  iconUrl: z.string(),
  shortName: z.string(),
  name: z.string(),
  id: z.string(),
  ringId: z.string(),
  team: projectTeamResponseSchema,
  archived: z.boolean(),
});

export type ProjectTeamResponse = z.infer<typeof projectTeamResponseSchema>;

export const projectWithTeamUsersResponseSchema = projectResponseSchema.extend({
  team: projectTeamWithUsersResponseSchema,
});

export const projectListResponseSchema = z.array(projectResponseSchema);
export const projectWithTeamUsersListResponseSchema = z.array(
  projectWithTeamUsersResponseSchema,
);

export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectWithTeamUsersResponse = z.infer<
  typeof projectWithTeamUsersResponseSchema
>;
export type ProjectListResponse = z.infer<typeof projectListResponseSchema>;
export type ProjectWithUsersListResponse = z.infer<
  typeof projectWithTeamUsersListResponseSchema
>;

export const organizationResponseSchema = z.object({
  projects: projectListResponseSchema,
  iconUrl: z.string(),
  projectsCount: z.number(),
  name: z.string(),
  id: z.string(),
  ringId: z.string(),
});

export const organizationListResponseSchema = z.array(
  organizationResponseSchema,
);

export type OrganizationResponse = z.infer<typeof organizationResponseSchema>;
export type OrganizationListResponse = z.infer<
  typeof organizationListResponseSchema
>;

export const sourcedProjectRolesResponseSchema = z.object({
  project: z.object({
    global: z.boolean(),
    name: z.string(),
  }),
  role: z.object({
    key: z.string(),
  }),
});
export const sourcedProjectRolesListResponseSchema = z.object({
  sourcedprojectroles: z.array(sourcedProjectRolesResponseSchema),
});

export const durationSchema = z.object({
  minutes: z.number(),
  presentation: z.string(),
});

export const issueResponseSchema = z.object({
  idReadable: z.string(),
  id: z.string(),
  created: z.number(), // The timestamp in milliseconds indicating the moment when the issue was created. Stored as a unix timestamp at UTC. Read-only.
  summary: z.string(),
  project: z.object({
    ringId: z.string(),
  }),
});

export type YouTrackIssue = z.infer<typeof issueResponseSchema>;

export const workTimeResponseSchema = z.object({
  duration: durationSchema,
  issue: issueResponseSchema,
  type: z
    .object({
      name: z.string(), // TODO this can be an enum
    })
    .nullable(),
  date: z.number(), // UTC timestamp
  text: z.string().optional(),
  id: z.string(),
});

export const workTimeListResponseSchema = z.array(workTimeResponseSchema);

export type WorkTimeResponse = z.infer<typeof workTimeResponseSchema>;
export type WorkTimeListResponse = z.infer<typeof workTimeListResponseSchema>;

export const rawReducedUserSchema = z.object({
  login: z.string(),
  email: z.string().nullable(),
  fullName: z.string(),
  ringId: z.string(),
  avatarUrl: z.string(),
  id: z.string(),
  banned: z.boolean(),
});

export const reducedUserSchema = rawReducedUserSchema.extend({
  email: z.string().email().nullable(),
  relatedUserEmails: z.array(z.string()), // a user may be linked to multiple (usually banned) other users, due to the sync of our YT with external issue trackers
});

export type ReducedUser = z.infer<typeof reducedUserSchema>;

export const rawReducedUserListResponseSchema = z.array(rawReducedUserSchema);
export const reducedUserListResponseSchema = z.array(reducedUserSchema);
