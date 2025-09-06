import { useFormContext, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ErrorFormField from "../form/ErrorFormField";

export default function PersonalInfo() {
  const { control, setValue, watch } = useFormContext();
  const file = watch("personal.profilePicture");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-xl font-semibold">Personal Info</p>
      <ErrorFormField
        name="personal.fullName"
        control={control}
        label="Full Name"
      >
        {(field) => (
          <Input placeholder="e.g. Jane Doe" {...field} className="h-12" />
        )}
      </ErrorFormField>

      <ErrorFormField name="personal.email" control={control} label="Email">
        {(field) => (
          <Input
            type="email"
            placeholder="jane@company.com"
            {...field}
            className="h-12"
          />
        )}
      </ErrorFormField>

      <ErrorFormField
        name="personal.phone"
        control={control}
        label="Phone (+1-123-456-7890)"
      >
        {(field) => (
          <Input placeholder="+1-123-456-7890" {...field} className="h-12" />
        )}
      </ErrorFormField>

      <ErrorFormField
        name="personal.dob"
        control={control}
        label="Date of Birth"
      >
        {(field) => <Input type="date" {...field} className="h-12" />}
      </ErrorFormField>

      <div className="flex flex-col gap-2 md:col-span-2">
        <Label>Profile Picture (JPG/PNG, max 2MB)</Label>
        <Controller
          control={control}
          name="personal.profilePicture"
          render={({ field: { onChange } }) => (
            <Input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => onChange(e.target.files?.[0] || null)}
              className="cursor-pointer"
            />
          )}
        />
        {file && (
          <p className="text-xs text-muted-foreground mt-1">
            Selected: <span className="text-green-600">{file.name}</span>
          </p>
        )}
      </div>
    </div>
  );
}
