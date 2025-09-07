This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, download or clone the repository and open with a code editor. Install the dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Explanation of How Complex Logic Was Handled


## 1. Dynamic Validation with Zod

Validation schemas for each step (e.g., personalInfoSchema, jobDetailsSchema) are defined using Zod. These schemas validate fields based on the form's current state, ensuring that the input values conform to required formats (such as emails, phone numbers, etc.).

For instance:

Full Name must have at least two words.

Start Date cannot be in the past and must be within 90 days.

Phone Number follows a specific format (+1-123-456-7890).

Zod's schema .refine() and .regex() methods are used to implement these dynamic checks.

## 2. Cross-Step Logic

Manager List: The manager list is filtered by department. This means that once the user selects a department, only managers from that department are shown in the Manager dropdown.

Skills List: Similar to the manager list, the skills list is dependent on the selected department. Each department has its own set of skills, and when the user selects a department, the available skills are updated dynamically.

Start Date Validation for HR/Finance: If the department is HR or Finance, the start date must not be on a weekend (Friday or Saturday). This is handled by checking the day of the week when the user selects a start date and showing an error message if the date falls on a weekend.

## 3. Conditional Form Fields

Certain fields are displayed conditionally based on the form data:

If the user is under 21 years old (based on the Date of Birth field), a Guardian Contact section is shown in the emergency contact step.

If the user selects Contract as the job type, the salary input changes to an hourly rate instead of annual salary.

If the Remote Work Preference is greater than 50%, a "Manager Approved" checkbox is shown.

## 4. Progression and Form State

The form follows a multi-step process:

Users cannot proceed to the next step if there are validation errors in the current step.

The user can navigate between steps using Next and Back buttons.

Form state is managed globally using React Hook Form, and the current form state is saved across all steps.

## 5. Form Review and Submission

At the final step, all the information entered in previous steps is shown for the user to review before submission. The user must confirm that all information is correct by checking a checkbox before submitting the form.

## 6. Local Form State

The form's state is saved locally in the React context (FormContext.js). This avoids relying on localStorage or other persistent storage solutions but ensures that the form data persists while navigating through the steps.

## bAssumptions

## Data Persistence:

The form data is stored in memory (using React state) and is lost when the page is refreshed. This is acceptable for the scope of this project, but in a real-world scenario, you would likely store the data in a backend or a more persistent storage solution.

## Manager List:

The manager list is pre-defined in the mock data and is filtered based on the selected department. If the list of managers changes in the future, you will need to update the mockManagers data.

## Salary Validation:

For Contract job types, the salary is set to an hourly rate. If this is to be changed in the future (e.g., hourly rate for full-time employees), the logic will need to be updated.

## Skills and Department Relationship:

Skills are static in the mock data (skillsByDepartment). In a real-world scenario, these could be fetched dynamically based on the department or changed over time.

## Error Handling:

Basic error handling is implemented using Zod validation and React Hook Form's built-in error handling. However, more complex scenarios (e.g., network errors during submission) are not considered.

## Accessibility:

Keyboard navigation (using Tab, Enter, etc.) is assumed to be a basic requirement and has been kept in mind when designing the form. However, detailed accessibility checks (e.g., ARIA roles, keyboard navigation for custom components) were not fully implemented in this task.

## File Validation:

File validation for the profile picture is only checking file size (under 2MB) and type (JPEG/PNG). In a production environment, additional checks for file integrity or type could be necessary.