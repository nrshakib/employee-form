import { z } from "zod";

const phoneRegex = /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/;

const today = new Date();
const addDays = (d, n) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};
const toDate = (v) => (v ? new Date(v) : null);
const isWeekendFriSat = (d) => {
  const day = d.getDay();
  return day === 5 || day === 6;
};

export const personalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3)
    .refine(
      (v) => v.split(/\s+/).length >= 2,
      "Please enter your First and Last Name (* minimum 2 Words)"
    ),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex, "Enter a valid phone number"),
  dob: z
    .string()
    .min(1, "DOB is required")
    .refine((v) => {
      const d = new Date(v);
      const age = (today - d) / (365.25 * 24 * 3600 * 1000);
      return age >= 18;
    }, "Age must be at least 18"),
  profilePicture: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      const okType = ["image/jpeg", "image/png"].includes(file.type);
      const okSize = file.size <= 2 * 1024 * 1024;
      return okType && okSize;
    }, "Only JPG/PNG up to 2MB"),
});

export const jobSchema = z
  .object({
    department: z.enum(["Engineering", "Marketing", "Sales", "HR", "Finance"], {
      required_error: "Select a department",
    }),
    positionTitle: z.string().trim().min(3),
    startDate: z.string().min(1),
    jobType: z.enum(["Full-time", "Part-time", "Contract"], {
      required_error: "Select a job type",
    }),
    annualSalary: z.union([z.string(), z.number()]).optional(),
    hourlyRate: z.union([z.string(), z.number()]).optional(),
    managerId: z.string().optional(),
    managerApproved: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // start date not in the past, <= 90 days in future
    const startingDate = toDate(data.startDate);
    if (!startingDate) return;
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    if (startingDate < startOfToday)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date cannot be in the past",
      });
    if (startingDate > addDays(startOfToday, 90))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Start date must be within 90 days",
      });

    // weekend restriction for HR/Finance (Fri, Sat)
    if (
      ["HR", "Finance"].includes(data.department) &&
      isWeekendFriSat(startingDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "For HR/Finance, start date cannot be Fri or Sat",
      });
    }

    // salary logic
    if (data.jobType === "Full-time") {
      const n = Number(data.annualSalary);
      if (!(n >= 30000 && n <= 200000))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["annualSalary"],
          message: "$30k - $200k",
        });
    }
    if (data.jobType === "Contract") {
      const n = Number(data.hourlyRate);
      if (!(n >= 50 && n <= 150))
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["hourlyRate"],
          message: "$50 - $150/hr",
        });
    }
  });

export const skillsSchema = z
  .object({
    primarySkills: z.array(z.string()).min(3, "Select at least 3 skills"),
    experienceBySkill: z
      .record(z.string(), z.union([z.string(), z.number()]).optional())
      .default({}),
    workHours: z.object({ start: z.string().min(1), end: z.string().min(1) }),
    remotePreference: z.number().min(0).max(100),
    notes: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    // End after start
    const [sh, sm] = (data.workHours.start || "").split(":").map(Number);
    const [eh, em] = (data.workHours.end || "").split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (!(end > start))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["workHours", "end"],
        message: "End must be after start",
      });
  });

export const emergencySchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().regex(phoneRegex, "Format +1-123-456-7890"),
  guardian: z
    .object({ name: z.string().min(1), phone: z.string().regex(phoneRegex) })
    .optional(),
});

export const reviewSchema = z.object({
  confirmed: z.boolean().refine(Boolean, "You must confirm before submitting"),
});

export const metaSchema = z.object({ isUnder21: z.boolean().default(false) });

export const masterSchema = z
  .object({
    personal: personalSchema,
    job: jobSchema,
    skills: skillsSchema,
    emergency: emergencySchema,
    review: reviewSchema,
    meta: metaSchema,
  })
  .superRefine((data, ctx) => {
    // Manager approval when remote > 50
    if ((data.skills.remotePreference || 0) > 50 && !data.job.managerApproved) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["job", "managerApproved"],
        message: "Manager approval required when remote > 50%",
      });
    }
    // Guardian required when under 21
    const dob = new Date(data.personal.dob);
    const age = (new Date() - dob) / (365.25 * 24 * 3600 * 1000);
    const under21 = age < 21;
    if (under21) {
      if (!data.emergency.guardian?.name)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergency", "guardian", "name"],
          message: "Guardian name required",
        });
      if (!data.emergency.guardian?.phone)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergency", "guardian", "phone"],
          message: "Guardian phone required",
        });
    }
  });

export const stepSchemas = [
  z.object({ personal: personalSchema, meta: metaSchema }),
  z.object({ job: jobSchema }),
  z.object({ skills: skillsSchema }),
  z.object({ emergency: emergencySchema }),
  z.object({ review: reviewSchema }),
];

export const defaultValues = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    profilePicture: null,
  },
  job: {
    department: undefined,
    positionTitle: "",
    startDate: "",
    jobType: undefined,
    annualSalary: "",
    hourlyRate: "",
    managerId: "",
    managerApproved: false,
  },
  skills: {
    primarySkills: [],
    experienceBySkill: {},
    workHours: { start: "09:00", end: "17:00" },
    remotePreference: 0,
    notes: "",
  },
  emergency: { name: "", relationship: "", phone: "" },
  review: { confirmed: false },
  meta: { isUnder21: false },
};
