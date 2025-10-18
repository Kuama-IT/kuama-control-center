import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notifySuccess } from "@/modules/ui/components/notify";
import { copyToClipboard } from "@/modules/ui/ui-utils";

export const CopyButton = ({
    className = "",
    contentToCopy,
    successMessage,
}: {
    className?: string;
    contentToCopy: string;
    successMessage: string;
}) => {
    return (
        <Button
            size="icon"
            className={`cursor-pointer ${className}`}
            onClick={() => {
                copyToClipboard(contentToCopy);
                notifySuccess(successMessage);
            }}
        >
            <Copy />
        </Button>
    );
};
