import { useFieldArray, Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DynamicListProps<T> {
  name: string; 
  control: Control<any>;
  fields: { label: string; name: keyof T; type?: string; placeholder?: string }[];
}

export function DynamicList<T>({ name, control, fields }: DynamicListProps<T>) {
  const { fields: items, append, remove } = useFieldArray({ name, control });

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} className="space-y-2 mb-4 border p-4 rounded">
          {fields.map((f) => (
            <FormField
              key={f.name as string}
              control={control}
              name={`${name}.${index}.${String(f.name)}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{f.label}</FormLabel>
                  <Input
                    {...field}
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(f.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value)
                    }
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="destructive" onClick={() => remove(index)}>
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={() => append(fields.reduce((acc, f) => ({ ...acc, [f.name]: f.type === "number" ? null : "" }), {}))}
      >
        Add
      </Button>
    </div>
  );
}
