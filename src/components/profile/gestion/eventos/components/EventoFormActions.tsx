
import { Button } from "@/components/ui/button";

type EventoFormActionsProps = {
  isLoading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
};

export const EventoFormActions = ({
  isLoading,
  isEditing,
  onCancel,
}: EventoFormActionsProps) => {
  return (
    <div className="flex gap-4">
      <Button type="submit" className="flex-1" disabled={isLoading}>
        {isLoading ? "Procesando..." : isEditing ? "Actualizar Evento" : "Crear Evento"}
      </Button>

      {isEditing && onCancel && (
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancelar Edición
        </Button>
      )}
    </div>
  );
};
