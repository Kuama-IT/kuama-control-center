import { copyToClipboard } from "@/modules/ui/ui-utils";
import { notifySuccess } from "@/modules/ui/components/notify";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

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
