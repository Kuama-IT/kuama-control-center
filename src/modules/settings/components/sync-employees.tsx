import { Button } from "@/components/ui/button";
import syncDipendentiInCloudEmployees from "@/modules/sync-data/actions/sync-dipendenti-in-cloud-employees-action";

// TODO would be nice to show loading state and give feedback upon completion
export const SyncEmployees = () => {
  return (
    <div className="rounded-lg p-4 border">
      <form action={syncDipendentiInCloudEmployees}>
        <Button>Sync employees from Dipendenti in Cloud</Button>
      </form>
    </div>
  );
};
