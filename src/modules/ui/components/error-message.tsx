import { Failure } from "@/utils/server-action-utils";

export const ErrorMessage = ({ failure }: { failure: Failure }) => (
  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
    <pre>{failure.message}</pre>
  </div>
);
