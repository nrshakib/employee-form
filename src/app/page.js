"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

  return (
    <div>
      <p>Form</p>
    </div>
  );
}
