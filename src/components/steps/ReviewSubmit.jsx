import { useFormContext } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";

export default function StepReview({ allValues }) {
  console.log(allValues);
  const { setValue, watch } = useFormContext();
  const confirmed = watch("review.confirmed");

  const Row = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-1 border-b last:border-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="col-span-2 break-words">{value}</div>
    </div>
  );

  const { personal, job, skills, emergency } = allValues;

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold mb-2">Personal Info</h3>
        <Row label="Name" value={personal?.fullName} />
        <Row label="Email" value={personal?.email} />
        <Row label="Phone" value={personal?.phone} />
        <Row label="DOB" value={personal?.dob} />
      </section>
      <section>
        <h3 className="font-semibold mb-2">Job Details</h3>
        <Row label="Department" value={job?.department} />
        <Row label="Title" value={job?.positionTitle} />
        <Row label="Start Date" value={job?.startDate} />
        <Row label="Type" value={job?.jobType} />
        {job?.annualSalary && (
          <Row label="Annual Salary" value={`$${job.annualSalary}`} />
        )}
        {job?.hourlyRate && (
          <Row label="Hourly Rate" value={`$${job.hourlyRate}/hr`} />
        )}
      </section>
      <section>
        <h3 className="font-semibold mb-2">Skills & Preferences</h3>
        <Row
          label="Primary Skills"
          value={(skills?.primarySkills || []).join(", ")}
        />
        <Row
          label="Hours"
          value={`${skills?.workHours?.start || ""} - ${
            skills?.workHours?.end || ""
          }`}
        />
        <Row
          label="Remote Preference"
          value={`${skills?.remotePreference || 0}%`}
        />
        {job?.managerApproved && <Row label="Manager Approved" value="Yes" />}
        {skills?.notes && <Row label="Notes" value={skills.notes} />}
      </section>
      <section>
        <h3 className="font-semibold mb-2">Emergency Contact</h3>
        <Row label="Name" value={emergency?.name} />
        <Row label="Relationship" value={emergency?.relationship} />
        <Row label="Phone" value={emergency?.phone} />
        {emergency?.guardian && (
          <Row
            label="Guardian"
            value={`${emergency.guardian.name} (${emergency.guardian.phone})`}
          />
        )}
      </section>

      <label className="flex items-center gap-2 pt-2">
        <Checkbox
          checked={!!confirmed}
          onCheckedChange={(v) =>
            setValue("review.confirmed", Boolean(v), {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <span>I confirm all information is correct</span>
      </label>
    </div>
  );
}
