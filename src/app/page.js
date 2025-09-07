"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfo from "@/components/steps/PersonalInfo";
import JobDetails from "@/components/steps/JobDetails";
import Skills from "@/components/steps/Skills";
import EmergencyContact from "@/components/steps/EmergencyContact";
import ReviewSubmit from "@/components/steps/ReviewSubmit";
import { useAutosave } from "@/hooks/useAutoSave";
import Stepper from "@/components/Stepper";
import { useWarnUnload } from "@/hooks/useWarnUnload";
import { toast } from "sonner";
import { defaultValues, masterSchema, stepSchemas } from "@/lib/schema";

const steps = [
  { id: 0, label: "Personal" },
  { id: 1, label: "Job" },
  { id: 2, label: "Skills" },
  { id: 3, label: "Emergency" },
  { id: 4, label: "Review" },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(masterSchema),
    defaultValues: defaultValues,
  });

  const { handleSubmit, trigger, formState, reset, getValues } = form;
  const lastStep = step === steps.length - 1;

  // console.log("adasdsad", getValues("skills"));

  const { saved, saveNow, isDirtySinceSave } = useAutosave(form);
  useWarnUnload(isDirtySinceSave);

  const onNext = async () => {
    // console.log(`Step ${step + 1} Values:`, getValues());

    const schema = stepSchemas[step];
    const subsetKeys = Object.keys(schema.shape || schema.shape.skills.shape);
    // console.log("Validation Keys:", subsetKeys);
    // console.log("Form Values:", getValues());

    const isValid = await trigger(subsetKeys);
    // console.log("isValid", isValid);
    if (!isValid) {
      toast.error("Please fill up all the fields");
      return;
    }

    // Log form values whenever the user proceeds to the next step
    // console.log(`Step ${step + 1} Values:`, getValues());

    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const isNextDisabled = formState.isDirty && !formState.isValid;

  const onBack = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = (values) => {
    console.log("Submitted Values", values);
    reset(values, { keepValues: true });
  };

  return (
    <FormProvider {...form}>
      <Card className="shadow-lg rounded-lg border border-gray-200 max-w-1/2 mx-auto">
        <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
          <p className="text-xl font-semibold text-center">
            New Employee Onboarding
          </p>
        </CardHeader>
        <CardContent>
          <Stepper steps={steps} current={step} validation={formState.errors} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
            {step === 0 && <PersonalInfo />}
            {step === 1 && <JobDetails />}
            {step === 2 && <Skills />}
            {step === 3 && <EmergencyContact />}
            {step === 4 && <ReviewSubmit allValues={getValues()} />}

            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="text-sm text-muted-foreground">
                {saved
                  ? "All changes saved"
                  : isDirtySinceSave
                  ? "Unsaved changes"
                  : ""}
              </div>
              <div className="flex gap-2">
                {step > 0 && (
                  <Button type="button" variant="outline" onClick={onBack}>
                    Back
                  </Button>
                )}
                {step < 4 && (
                  <Button
                    type="button"
                    onClick={onNext}
                    // disabled={isNextDisabled}
                  >
                    Next
                  </Button>
                )}
                {lastStep && (
                  <Button
                    type="submit"
                    disabled={!getValues("review.confirmed")}
                  >
                    Submit
                  </Button>
                )}
                <Button type="button" variant="secondary" onClick={saveNow}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
