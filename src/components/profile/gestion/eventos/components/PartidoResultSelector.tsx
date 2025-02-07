
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PartidoResultSelectorProps = {
  resultado: "2/0" | "2/1" | "1/2" | "0/2" | null;
  onResultadoChange: (resultado: "2/0" | "2/1" | "1/2" | "0/2" | null) => void;
};

export const PartidoResultSelector = ({
  resultado,
  onResultadoChange,
}: PartidoResultSelectorProps) => {
  return (
    <Select
      value={resultado || "sin_resultado"}
      onValueChange={(value) => {
        const newResultado = value === "sin_resultado" ? null : (value as "2/0" | "2/1" | "1/2" | "0/2");
        onResultadoChange(newResultado);
      }}
    >
      <SelectTrigger className="w-24">
        <SelectValue placeholder="--" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="sin_resultado">--</SelectItem>
        <SelectItem value="2/0">2-0</SelectItem>
        <SelectItem value="2/1">2-1</SelectItem>
        <SelectItem value="1/2">1-2</SelectItem>
        <SelectItem value="0/2">0-2</SelectItem>
      </SelectContent>
    </Select>
  );
};
