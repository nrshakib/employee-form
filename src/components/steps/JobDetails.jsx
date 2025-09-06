import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useFormContext } from "react-hook-form";
import ErrorFormField from "../form/ErrorFormField";

export default function JobDetails() {
  const { control, watch, setValue } = useFormContext();
  const jobType = watch("job.jobType");
  const dept = watch("job.department");
  const remote = watch("skills.remotePreference");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <p>Job Details</p>
      <ErrorFormField
        name="job.department"
        control={control}
        label="Department"
      >
        {() => (
          <Select
            onValueChange={(v) =>
              setValue("job.department", v, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {["Engineering", "Marketing", "Sales", "HR", "Finance"].map(
                  (d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </ErrorFormField>

      <ErrorFormField
        name="job.positionTitle"
        control={control}
        label="Position Title"
      >
        {(field) => <Input placeholder="e.g. Frontend Engineer" {...field} />}
      </ErrorFormField>

      <ErrorFormField name="job.startDate" control={control} label="Start Date">
        {(field) => <Input type="date" {...field} />}
      </ErrorFormField>

      <div>
        <Label>Job Type</Label>
        <RadioGroup
          value={jobType}
          onValueChange={(v) =>
            setValue("job.jobType", v, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          className="mt-2"
        >
          {["Full-time", "Part-time", "Contract"].map((t) => (
            <div key={t} className="flex items-center space-x-2">
              <RadioGroupItem value={t} id={t} />
              <Label htmlFor={t}>{t}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {jobType === "Full-time" && (
        <ErrorFormField
          name="job.annualSalary"
          control={control}
          label="Annual Salary (USD)"
        >
          {(field) => (
            <Input
              type="number"
              min={30000}
              max={200000}
              step={1000}
              {...field}
            />
          )}
        </ErrorFormField>
      )}

      {jobType === "Contract" && (
        <ErrorFormField
          name="job.hourlyRate"
          control={control}
          label="Hourly Rate (USD)"
        >
          {(field) => (
            <Input type="number" min={50} max={150} step={1} {...field} />
          )}
        </ErrorFormField>
      )}

      {remote > 50 && (
        <ErrorFormField
          name="job.managerApproved"
          control={control}
          label="Manager Approved"
        >
          {(field) => (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.value || false}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <span className="text-sm">
                Required since remote preference is greater than 50%
              </span>
            </div>
          )}
        </ErrorFormField>
      )}
    </div>
  );
}
