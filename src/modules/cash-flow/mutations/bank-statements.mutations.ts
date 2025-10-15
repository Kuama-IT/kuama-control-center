"use client";

import { useState } from "react";
import { type BankStatementForm } from "../schemas/bank-statement-form.schema";

export const useCreateBankStatementMutation = () => {
    const [progress, setProgress] = useState<number>(0);
    const [isPending, setIsPending] = useState<boolean>(false);

    return {
        mutate: async (
            form: BankStatementForm,
            { onSuccess }: { onSuccess: () => void },
        ) => {
            const file = form.file;
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileName", file.name);

            return new Promise<void>((resolve, reject) => {
                setIsPending(true);
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/api/bank-statements", true);
                // Do NOT set Content-Type, browser will set it for FormData

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round(
                            (event.loaded / event.total) * 100,
                        );
                        setProgress(percent);
                    }
                };

                xhr.onload = () => {
                    setIsPending(false);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            onSuccess();
                            resolve();
                        } catch (_e) {
                            reject(new Error("Failed to parse response"));
                        }
                    } else {
                        reject(new Error("Failed to upload bank statement"));
                    }
                };

                xhr.onerror = () => {
                    setIsPending(false);
                    reject(new Error("Network error"));
                };

                xhr.send(formData);
            });
        },
        isPending,
        progress,
    };
};
