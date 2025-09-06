import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { mockManagers } from "@/lib/dummyData";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

export default function ManagerHandler() {
  const { watch, setValue } = useFormContext();
  const dept = watch("job.department");
  const managerId = watch("job.managerId");

  const options = useMemo(
    () => mockManagers.filter((m) => !dept || m.department === dept),
    [dept]
  );

  const current = options.find((o) => o.id === managerId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {current ? current.name : "Select manager"}
          <ChevronsUpDown className="opacity-50" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[320px]">
        <Command>
          <CommandInput placeholder="Search manager" />
          <CommandEmpty>No manager found.</CommandEmpty>
          <CommandGroup>
            {options.map((o) => (
              <CommandItem
                key={o.id}
                value={o.name}
                onSelect={() =>
                  setValue("job.managerId", o.id, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                {o.name}
                <span className="ml-auto text-xs text-muted-foreground">
                  {o.department}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
