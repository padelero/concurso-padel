
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type UseFormReturn } from "react-hook-form";
import type { EventoFormData } from "../types";

type EventoFormFieldProps = {
  form: UseFormReturn<EventoFormData>;
  name: keyof EventoFormData;
  label: string;
  type?: "text" | "datetime-local" | "textarea";
  placeholder?: string;
};

export const EventoFormField = ({
  form,
  name,
  label,
  type = "text",
  placeholder,
}: EventoFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                placeholder={placeholder}
                className="resize-none"
                {...field}
              />
            ) : (
              <Input type={type} placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
