import { toast } from "sonner";

export const notifySuccess = (message: string) => {
  return toast("K1 App", {
    description: message,
  });
};
export const notifyError = (message: string) => {
  return toast("K1 App", {
    description: message,
    className: "bg-error text-foreground",
  });
};
