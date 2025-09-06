"use client";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfo from "@/components/steps/PersonalInfo";
import JobDetails from "@/components/steps/JobDetails";
import Skills from "@/components/steps/Skills";
import EmergencyContact from "@/components/steps/EmergencyContact";
import ReviewSubmit from "@/components/steps/ReviewSubmit";
import { useAutosave } from "@/hooks/useAutoSave";
import Stepper from "@/components/Stepper";

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
  });

  const { handleSubmit, formState, getValues } = form;
  const lastStep = step === steps.length - 1;

  const { saved, saveNow, isDirtySinceSave } = useAutosave(form);

  const onNext = async () => {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onBack = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = (values) => {
    console.log("Submitter Values", values);
  };

  return (
    <FormProvider {...form}>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>New Employee Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <Stepper steps={steps} current={step} validation={formState.errors} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
            {step === 0 && <PersonalInfo />}
            {step === 1 && <JobDetails />}
            {step === 2 && <Skills />}
            {step === 3 && <EmergencyContact />}
            {step === 4 && <ReviewSubmit />}

            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="text-sm text-muted-foreground">
                {saved
                  ? "All changes saved"
                  : isDirtySinceSave
                  ? "Unsaved changes"
                  : ""}
              </div>
              <div className="ml-auto flex gap-2">
                {step > 0 && (
                  <Button type="button" variant="outline" onClick={onBack}>
                    Back
                  </Button>
                )}
                {step < 4 && (
                  <Button type="button" onClick={onNext}>
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
