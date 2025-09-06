"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PersonalInfo from "@/components/steps/PersonalInfo";
import JobDetails from "@/components/steps/JobDetails";
import { Button } from "@/components/ui/button";

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

  const { handleSubmit } = form;

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
            {step === 0 && <PersonalInfo />}
            {step === 1 && <JobDetails />}
          </form>
        </CardContent>
      </Card>
    </FormProvider>
  );
}
