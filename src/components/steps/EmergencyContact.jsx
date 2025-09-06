import { useFormContext } from "react-hook-form";
import ErrorFormField from "../form/ErrorFormField";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function EmergencyContact() {
  const { control, setValue, watch } = useFormContext();
  const under21 = watch("meta.isUnder21");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-xl font-semibold">Emergency Contact</p>
      <ErrorFormField
        name="emergency.name"
        control={control}
        label="Contact Name"
      >
        {(field) => (
          <Input placeholder="e.g. Alex Doe" {...field} className="h-12" />
        )}
      </ErrorFormField>

      <ErrorFormField
        name="emergency.relationship"
        control={control}
        label="Relationship"
      >
        {() => (
          <Select
            onValueChange={(v) =>
              setValue("emergency.relationship", v, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["Parent", "Sibling", "Spouse", "Friend", "Other"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </ErrorFormField>

      <ErrorFormField
        name="emergency.phone"
        control={control}
        label="Phone (+1-123-456-7890)"
      >
        {(field) => (
          <Input placeholder="+1-123-456-7890" {...field} className="h-12" />
        )}
      </ErrorFormField>

      {under21 && (
        <div className="md:col-span-2 border-t pt-4">
          <p className="font-medium mb-2">
            Guardian Contact (required because age &lt; 21)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ErrorFormField
              name="emergency.guardian.name"
              control={control}
              label="Guardian Name"
            >
              {(field) => <Input {...field} />}
            </ErrorFormField>
            <ErrorFormField
              name="emergency.guardian.phone"
              control={control}
              label="Guardian Phone"
            >
              {(field) => <Input placeholder="+1-123-456-7890" {...field} />}
            </ErrorFormField>
          </div>
        </div>
      )}
    </div>
  );
}
