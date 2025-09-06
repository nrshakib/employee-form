import { useEffect, useRef, useState } from "react";

export function useAutosave(form) {
  const { watch, getValues, formState } = form;
  const [saved, setSaved] = useState(false);
  const lastSavedRef = useRef(getValues());

  // track if there are unsaved changes vs lastSaved snapshot
  const isDirtySinceSave =
    JSON.stringify(getValues()) !== JSON.stringify(lastSavedRef.current);

  useEffect(() => {
    const sub = watch(() => {
      setSaved(false);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const saveNow = () => {
    lastSavedRef.current = getValues();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return { saved, saveNow, isDirtySinceSave };
}
