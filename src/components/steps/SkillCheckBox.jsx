import { Checkbox } from "../ui/checkbox";

export default function SkillCheckbox({ skill, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 py-1">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span>{skill}</span>
    </label>
  );
}
