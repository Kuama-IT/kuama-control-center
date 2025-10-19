"use client";

import { format } from "date-fns";
import { InfinityIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deleteAccessToken } from "@/modules/access-tokens/access-tokens.actions";
import { type AccessTokenRead } from "@/modules/access-tokens/schemas/access-token.schema";
import { CopyButton } from "@/modules/ui/components/copy-button";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/server-action-utils";

export const AccessTokenListItem = ({ token }: { token: AccessTokenRead }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const deleteToken = () => {
        startTransition(async () => {
            const res = await deleteAccessToken({ id: token.id });

            if (isFailure(res)) {
                notifyError(
                    "Error while deleting access token, check server logs",
                );
                return;
            }

            notifySuccess(res.message);
            router.refresh();
        });
    };
    return (
        <li className="relative flex flex-col gap-2 rounded border p-4">
            <span>{token.purpose}</span>
            <span className="absolute top-2 right-2"></span>
            <div className="flex items-center gap-4 text-sm uppercase">
                {!token.expiresAt && (
                    <>
                        <span className="flex items-center gap-2">
                            {"Allowed usages: "}
                            {token.allowedUsages === -1 ? (
                                <InfinityIcon />
                            ) : (
                                <pre className="mono rounded bg-gray-300 px-2">
                                    {token.allowedUsages}
                                </pre>
                            )}
                        </span>
                        <span className="flex items-center gap-2">
                            {"Usages:"}
                            <pre className="mono rounded bg-gray-300 px-2">
                                {token.usageCount}
                            </pre>
                        </span>
                        {"-"}
                    </>
                )}
                <span>{`Created at: ${format(token.createdAt, "PPP")}`}</span>
                {token.allowedUsages === -1 && token.expiresAt && (
                    <>
                        {"-"}
                        <span>{`Expires at ${format(token.expiresAt, "PPP")}`}</span>
                    </>
                )}
                <Button
                    variant="destructive"
                    className="ml-auto"
                    disabled={isPending}
                    onClick={deleteToken}
                >
                    <TrashIcon />
                </Button>
                <CopyButton
                    className="cursor-pointer rounded-md bg-black p-3 text-white"
                    contentToCopy={token.token}
                    successMessage="Token copied to clipboard"
                />
            </div>
        </li>
    );
};
