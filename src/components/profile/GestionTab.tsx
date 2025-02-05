
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const GestionTab = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Próximamente podrás gestionar los partidos desde aquí.
        </AlertDescription>
      </Alert>
    </div>
  );
};
