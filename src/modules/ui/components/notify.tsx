import { toast } from "sonner";

export const notifySuccess = (message: string) => {
  return toast("K1 App", {
    description: () => <p className="text-white">{message}</p>,
  });
};
export const notifyError = (message: string) => {
  return toast("K1 App", {
    description: () => <p className="text-red-500">{message}</p>,
    className: "bg-error",
  });
};
