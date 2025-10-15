"use client";

import { InfinityIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAccessToken } from "@/modules/access-tokens/access-tokens.actions";
import { AccessTokenRead } from "@/modules/access-tokens/schemas/access-token.schema";
import { CopyButton } from "@/modules/ui/components/copy-button";
import { notifyError, notifySuccess } from "@/modules/ui/components/notify";
import { isFailure } from "@/utils/server-action-utils";
import { format } from "date-fns";

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
        <li className="flex flex-col gap-2 border p-4 rounded relative">
            <span>{token.purpose}</span>
            <span className="absolute top-2 right-2"></span>
            <div className="uppercase flex gap-4 items-center text-sm">
                {!token.expiresAt && (
                    <>
                        <span className="flex items-center gap-2">
                            Allowed usages:{" "}
                            {token.allowedUsages === -1 ? (
                                <InfinityIcon />
                            ) : (
                                <pre className="mono px-2 bg-gray-300 rounded">
                                    {token.allowedUsages}
                                </pre>
                            )}
                        </span>
                        <span className="flex gap-2 items-center">
                            Usages:
                            <pre className="mono px-2 bg-gray-300 rounded">
                                {token.usageCount}
                            </pre>
                        </span>
                        -
                    </>
                )}
                <span>Created at: {format(token.createdAt, "PPP")}</span>
                {token.allowedUsages === -1 && token.expiresAt && (
                    <>
                        -
                        <span>Expires at {format(token.expiresAt, "PPP")}</span>
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
                    className="cursor-pointer text-white bg-black rounded-md p-3"
                    contentToCopy={token.token}
                    successMessage="Token copied to clipboard"
                />
            </div>
        </li>
    );
};
