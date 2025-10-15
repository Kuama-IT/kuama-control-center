import { auth } from "@/modules/auth/auth";
import { firstOrThrow } from "@/utils/array-utils";
import { INFINITE_USAGES, accessTokensDb } from "./access-tokens.db";
import {
    accessTokenCreateResultSchema,
    accessTokenCreateSchema,
    accessTokenDeleteResultSchema,
    accessTokenListResultSchema,
    accessTokenReadSchema,
    type AccessTokenCreate,
    type AccessTokenCreateResult,
    type AccessTokenDeleteResult,
    type AccessTokenListResult,
    type AccessTokenRead,
} from "./schemas/access-token.schema";

export const accessTokensServer = {
    async list(): Promise<AccessTokenListResult> {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            throw new Error("You are not allowed to list access tokens");
        }

        const records = await accessTokensDb.findAll();

        return accessTokenListResultSchema.parse(records);
    },
    async getUnlimitedToken(): Promise<AccessTokenRead> {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            throw new Error("You are not allowed to list access tokens");
        }

        const result = await accessTokensDb.findUnlimited();

        const token = firstOrThrow(result);

        return accessTokenReadSchema.parse(token);
    },
    async create(dto: AccessTokenCreate): Promise<AccessTokenCreateResult> {
        const parsed = accessTokenCreateSchema.parse(dto);

        const session = await auth();
        if (!session?.user?.isAdmin) {
            throw new Error("You are not allowed to create an access token");
        }

        const inserted = await accessTokensDb.insert({
            ...parsed,
            token: crypto.randomUUID(),
        });

        const createdToken = firstOrThrow(inserted);

        return accessTokenCreateResultSchema.parse({
            message: `Access token ${createdToken.purpose} created`,
            data: createdToken,
        });
    },
    async remove({ id }: { id: number }): Promise<AccessTokenDeleteResult> {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            throw new Error("You are not allowed to delete an access token");
        }

        const records = await accessTokensDb.findById(id);
        const record = firstOrThrow(records);

        await accessTokensDb.deleteById(id);

        return accessTokenDeleteResultSchema.parse({
            message: `Access token ${record.purpose} deleted`,
        });
    },
    async manage(accessToken: string): Promise<void> {
        const queryResult = await accessTokensDb.findByToken(accessToken);

        const token = firstOrThrow(queryResult);

        if (token.allowedUsages === INFINITE_USAGES) {
            await accessTokensDb.updateUsage(
                token.id,
                (token.usageCount ?? 0) + 1,
            );
            return;
        }

        if (token.allowedUsages != null) {
            const usageCount = token.usageCount ?? 0;
            const allowedUsages = token.allowedUsages;

            if (usageCount > allowedUsages) {
                throw new Error("Token has reached the maximum allowed usages");
            }

            if (usageCount + 1 === allowedUsages) {
                await accessTokensDb.deleteById(token.id);
                return;
            }

            await accessTokensDb.updateUsage(token.id, usageCount + 1);
            return;
        }

        const now = new Date();
        const expirationDate = token.expiresAt;
        if (expirationDate && expirationDate < now) {
            await accessTokensDb.deleteById(token.id);
            throw new Error("Token has expired");
        }

        await accessTokensDb.updateUsage(token.id, (token.usageCount ?? 0) + 1);
    },
};
