import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Controller, useForm, useWatch } from "react-hook-form";

import { PageHeader } from "@/components/blocks";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants";

import {
  charCountStyles,
  checkboxGroupStyles,
  checkboxNameStyles,
  checkboxRoleStyles,
  checkboxRowStyles,
  checkboxTextStyles,
  footerStyles,
  formStyles,
  pageStyles,
  selectTriggerStyles,
  switchRowStyles,
  twoColumnStyles,
} from "./ProjectFormPage.styles";
import {
  projectFormSchema,
  type ProjectFormValues,
} from "./ProjectFormPage.schema";
import type { SelectOption, TeamMemberOption } from "./types";

const CLIENTS: SelectOption[] = [
  { value: "aurora", label: "Aurora Health" },
  { value: "northwind", label: "Northwind Traders" },
  { value: "vertex", label: "Vertex Robotics" },
  { value: "lumen", label: "Lumen Retail" },
  { value: "solace", label: "Solace Financial" },
];

const LEADS: SelectOption[] = [
  { value: "priya", label: "Priya Sharma" },
  { value: "daniel", label: "Daniel Cho" },
  { value: "meera", label: "Meera Iyer" },
  { value: "owen", label: "Owen Bennett" },
];

const TEAM: TeamMemberOption[] = [
  { id: "priya", name: "Priya Sharma", role: "Product designer" },
  { id: "daniel", name: "Daniel Cho", role: "Frontend engineer" },
  { id: "meera", name: "Meera Iyer", role: "Design lead" },
  { id: "owen", name: "Owen Bennett", role: "Researcher" },
];

const DESCRIPTION_LIMIT = 280;

const clientItems = Object.fromEntries(
  CLIENTS.map((option) => [option.value, option.label]),
);
const leadItems = Object.fromEntries(
  LEADS.map((option) => [option.value, option.label]),
);

export function ProjectFormPage() {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    mode: "onTouched",
    defaultValues: {
      projectName: "",
      clientId: "",
      description: "",
      startDate: "",
      priority: "medium",
      projectLead: "",
      teamMembers: [],
      emailUpdates: true,
      makePrivate: false,
    },
  });

  const description = useWatch({ control, name: "description" }) ?? "";

  const onSubmit = handleSubmit(() => {
    navigate(ROUTES.PREVIEW_LISTING);
  });

  return (
    <section className={pageStyles} aria-label="New project form">
      <PageHeader
        breadcrumbs={[
          { label: "Projects", href: ROUTES.PREVIEW_LISTING },
          { label: "New project" },
        ]}
        title="New project"
        description="Set up a new client engagement and assign the team."
      />

      <form className={formStyles} onSubmit={onSubmit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Basic information</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Field data-invalid={Boolean(errors.projectName)}>
                  <FieldLabel htmlFor="projectName">Project name</FieldLabel>
                  <Input
                    id="projectName"
                    placeholder="e.g. Aurora Care Portal"
                    aria-invalid={Boolean(errors.projectName)}
                    aria-describedby={
                      errors.projectName ? "projectName-error" : undefined
                    }
                    {...register("projectName")}
                  />
                  <FieldError
                    id="projectName-error"
                    errors={[errors.projectName]}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="projectCode">Project code</FieldLabel>
                  <Input
                    id="projectCode"
                    value="PRJ-2026-018"
                    readOnly
                    disabled
                  />
                  <FieldDescription>
                    Generated automatically once the project is saved.
                  </FieldDescription>
                </Field>

                <section
                  className={twoColumnStyles}
                  aria-label="Client and start date"
                >
                  <Controller
                    control={control}
                    name="clientId"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={Boolean(fieldState.error)}>
                        <FieldLabel htmlFor="clientId">Client</FieldLabel>
                        <Select
                          value={field.value}
                          items={clientItems}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="clientId"
                            className={selectTriggerStyles}
                            aria-invalid={Boolean(fieldState.error)}
                          >
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                          <SelectContent>
                            {CLIENTS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError errors={[fieldState.error]} />
                      </Field>
                    )}
                  />

                  <Field data-invalid={Boolean(errors.startDate)}>
                    <FieldLabel htmlFor="startDate">Start date</FieldLabel>
                    <Input
                      id="startDate"
                      type="date"
                      aria-invalid={Boolean(errors.startDate)}
                      aria-describedby={
                        errors.startDate ? "startDate-error" : undefined
                      }
                      {...register("startDate")}
                    />
                    <FieldError
                      id="startDate-error"
                      errors={[errors.startDate]}
                    />
                  </Field>
                </section>

                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="What is this project about?"
                    {...register("description")}
                  />
                  <FieldDescription>
                    Optional.{" "}
                    <small className={charCountStyles}>
                      {description.length}/{DESCRIPTION_LIMIT}
                    </small>
                  </FieldDescription>
                  <FieldError errors={[errors.description]} />
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Priority</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FieldLabel htmlFor="priority-low">
                          <RadioGroupItem id="priority-low" value="low" />
                          Low — nice to have this quarter
                        </FieldLabel>
                        <FieldLabel htmlFor="priority-medium">
                          <RadioGroupItem id="priority-medium" value="medium" />
                          Medium — planned for this quarter
                        </FieldLabel>
                        <FieldLabel htmlFor="priority-high">
                          <RadioGroupItem id="priority-high" value="high" />
                          High — actively at risk if delayed
                        </FieldLabel>
                      </RadioGroup>
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="emailUpdates"
                  render={({ field }) => (
                    <Field orientation="horizontal" className={switchRowStyles}>
                      <FieldContent>
                        <FieldLabel htmlFor="emailUpdates">
                          Weekly email updates
                        </FieldLabel>
                        <FieldDescription>
                          Send the client a Monday summary of progress.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        id="emailUpdates"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="makePrivate"
                  render={({ field }) => (
                    <Field orientation="horizontal" className={switchRowStyles}>
                      <FieldContent>
                        <FieldLabel htmlFor="makePrivate">
                          Private project
                        </FieldLabel>
                        <FieldDescription>
                          Only invited members can see this project.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        id="makePrivate"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="teamMembers"
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLegend variant="label">Team members</FieldLegend>
                  <ul className={checkboxGroupStyles}>
                    {TEAM.map((member) => {
                      const checked = field.value.includes(member.id);
                      return (
                        <li key={member.id} className={checkboxRowStyles}>
                          <Checkbox
                            id={`member-${member.id}`}
                            checked={checked}
                            onCheckedChange={(next) => {
                              field.onChange(
                                next
                                  ? [...field.value, member.id]
                                  : field.value.filter(
                                      (id) => id !== member.id,
                                    ),
                              );
                            }}
                          />
                          <FieldLabel
                            htmlFor={`member-${member.id}`}
                            className={checkboxTextStyles}
                          >
                            <strong className={checkboxNameStyles}>
                              {member.name}
                            </strong>
                            <small className={checkboxRoleStyles}>
                              {member.role}
                            </small>
                          </FieldLabel>
                        </li>
                      );
                    })}
                  </ul>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="projectLead"
              render={({ field, fieldState }) => (
                <Field data-invalid={Boolean(fieldState.error)}>
                  <FieldLabel htmlFor="projectLead">Project lead</FieldLabel>
                  <Select
                    value={field.value}
                    items={leadItems}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="projectLead"
                      className={selectTriggerStyles}
                      aria-invalid={Boolean(fieldState.error)}
                    >
                      <SelectValue placeholder="Select a project lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEADS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </CardContent>
        </Card>

        <footer className={footerStyles}>
          <Link
            to={ROUTES.PREVIEW_LISTING}
            className={buttonVariants({ variant: "secondary" })}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            Save changes
          </Button>
        </footer>
      </form>
    </section>
  );
}

export default ProjectFormPage;
