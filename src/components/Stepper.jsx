import { cn } from "@/lib/utils";

export default function Stepper({ steps, current, validation }) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((s, idx) => {
        const hasError =
          Object.keys(validation || {}).length > 0 && idx === current;
        return (
          <li
            key={s.id}
            className={cn(
              "flex items-center gap-2 rounded-lg border p-2 text-sm w-40",
              idx === current && "border-primary",
              hasError && "border-destructive"
            )}
          >
            <span
              className={cn(
                "size-6 rounded-full grid place-items-center text-xs",
                idx <= current
                  ? "bg-red-500 text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {idx + 1}
            </span>
            <span>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
