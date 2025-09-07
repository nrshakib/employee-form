import { useEffect, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { skillsByDepartment } from "@/lib/dummyData";
import ErrorFormField from "../form/ErrorFormField";

import SkillCheckbox from "./SkillCheckBox";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

export default function Skills() {
  const {
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const dept = watch("job.department");
  const selectedSkill = watch("skills.primarySkills", []);

  const skills = useMemo(() => skillsByDepartment[dept] || [], [dept]);

  // console.log(errors);

  useEffect(() => {
    const cleanedSkill = selectedSkill.filter((s) => skills.includes(s));
    if (cleanedSkill.length !== selectedSkill.length)
      setValue("skills.primarySkills", cleanedSkill, {
        shouldDirty: true,
        shouldValidate: true,
      });
  }, [dept, selectedSkill, skills, setValue]);

  const toggleSkill = (skill) => {
    const next = selectedSkill.includes(skill)
      ? selectedSkill.filter((s) => s !== skill)
      : [...selectedSkill, skill];
    setValue("skills.primarySkills", next, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-center text-xl font-semibold">Skills</p>
      <div>
        <p className="font-medium mb-2">Primary Skills (choose at least 3)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {skills.map((skill) => (
            <SkillCheckbox
              key={skill}
              skill={skill}
              checked={selectedSkill.includes(skill)}
              onChange={() => toggleSkill(skill)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedSkill.map((skill) => (
          <ErrorFormField
            key={skill}
            name={`skills.experienceBySkill.${skill}`}
            control={control}
            label={`${skill} experience (years)`}
          >
            {(field) => (
              <Controller
                name={`skills.experienceBySkill.${skill}`}
                control={control}
                defaultValue={field.value || ""}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    max={30}
                    step={1}
                    className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-primary"
                  />
                )}
              />
            )}
          </ErrorFormField>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ErrorFormField
          name="skills.workHours.start"
          control={control}
          label="Preferred Start Time"
        >
          {(field) => <Input type="time" {...field} />}
        </ErrorFormField>
        <ErrorFormField
          name="skills.workHours.end"
          control={control}
          label="Preferred End Time"
        >
          {(field) => <Input type="time" {...field} />}
        </ErrorFormField>
      </div>

      <div>
        <p className="font-medium mb-2">
          Remote Work Preference:{" "}
          <span className="font-normal">
            {watch("skills.remotePreference", 0)}%
          </span>
        </p>
        <Slider
          value={[watch("skills.remotePreference", 0)]}
          onValueChange={(v) =>
            setValue("skills.remotePreference", v[0], {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          max={100}
          step={5}
        />
      </div>

      <ErrorFormField name="skills.notes" control={control} label="Extra Notes">
        {(field) => (
          <textarea
            className="w-full rounded-md border p-2"
            rows={4}
            maxLength={500}
            {...field}
          />
        )}
      </ErrorFormField>
    </div>
  );
}
