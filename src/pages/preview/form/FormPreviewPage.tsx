import { useEffect, type ReactElement } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { PageHeader } from "@/components/blocks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSaveFormPreview } from "@/hooks";

import {
  CONTACT_METHOD_OPTIONS,
  NOTIFICATION_CHANNEL_OPTIONS,
  PROJECT_TYPE_OPTIONS,
} from "./FormPreviewPage.data";
import {
  formPreviewSchema,
  type FormPreviewValues,
} from "./FormPreviewPage.schema";
import { formPreviewPageStyles as styles } from "./FormPreviewPage.styles";

export const FormPreviewPage = (): ReactElement => {
  const { save } = useSaveFormPreview();
  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormPreviewValues>({
    resolver: zodResolver(formPreviewSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "not-an-email",
      projectType: "",
      notificationChannels: [],
      autoRenew: true,
      contactMethod: "",
      teamNotes: "",
      kickoffDate: "",
    },
  });

  useEffect(() => {
    void trigger("email");
  }, [trigger]);

  const onSubmit = (values: FormPreviewValues): void => {
    void save(values);
  };

  return (
    <section className={styles.wrapper}>
      <PageHeader
        title="New engagement"
        description="Set up a project brief for a new client engagement."
      />

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <FieldSet>
              <FieldLegend>Basic information</FieldLegend>
              <FieldGroup>
                <Field data-invalid={!!errors.fullName}>
                  <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                  <Input
                    id="fullName"
                    aria-invalid={!!errors.fullName}
                    {...register("fullName")}
                  />
                  {errors.fullName && (
                    <FieldError>{errors.fullName.message}</FieldError>
                  )}
                </Field>

                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                  />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>

                <Controller
                  control={control}
                  name="projectType"
                  render={({ field }) => (
                    <Field data-invalid={!!errors.projectType}>
                      <FieldLabel htmlFor="projectType">
                        Project type
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="projectType"
                          aria-invalid={!!errors.projectType}
                        >
                          <SelectValue placeholder="Select a project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {PROJECT_TYPE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.projectType && (
                        <FieldError>{errors.projectType.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <FieldSet>
              <FieldLegend>Preferences</FieldLegend>
              <FieldGroup>
                <Controller
                  control={control}
                  name="notificationChannels"
                  render={({ field }) => (
                    <Field data-invalid={!!errors.notificationChannels}>
                      <FieldLabel>Notification channels</FieldLabel>
                      {NOTIFICATION_CHANNEL_OPTIONS.map((option) => {
                        const checked = field.value.includes(option.value);
                        return (
                          <div
                            key={option.value}
                            className={styles.checkboxRow}
                          >
                            <Checkbox
                              id={`channel-${option.value}`}
                              checked={checked}
                              onCheckedChange={(next: boolean) => {
                                field.onChange(
                                  next
                                    ? [...field.value, option.value]
                                    : field.value.filter(
                                        (value) => value !== option.value,
                                      ),
                                );
                              }}
                            />
                            <FieldLabel htmlFor={`channel-${option.value}`}>
                              {option.label}
                            </FieldLabel>
                          </div>
                        );
                      })}
                      {errors.notificationChannels && (
                        <FieldError>
                          {errors.notificationChannels.message}
                        </FieldError>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="autoRenew"
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="autoRenew">
                        Auto-renew engagement
                      </FieldLabel>
                      <Switch
                        id="autoRenew"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldDescription>
                        Automatically extend this engagement each quarter.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <FieldSet>
              <FieldLegend>Team</FieldLegend>
              <FieldGroup>
                <Controller
                  control={control}
                  name="contactMethod"
                  render={({ field }) => (
                    <Field data-invalid={!!errors.contactMethod}>
                      <FieldLabel>Preferred contact method</FieldLabel>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {CONTACT_METHOD_OPTIONS.map((option) => (
                          <div
                            key={option.value}
                            className={styles.checkboxRow}
                          >
                            <RadioGroupItem
                              id={`contact-${option.value}`}
                              value={option.value}
                            />
                            <FieldLabel htmlFor={`contact-${option.value}`}>
                              {option.label}
                            </FieldLabel>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.contactMethod && (
                        <FieldError>{errors.contactMethod.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel htmlFor="teamNotes">Team notes</FieldLabel>
                  <Textarea id="teamNotes" {...register("teamNotes")} />
                  <FieldDescription>
                    Anything the delivery team should know before kickoff.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="legacyTeamId">Legacy team ID</FieldLabel>
                  <Input id="legacyTeamId" disabled value="TEAM-00421" />
                  <FieldDescription>
                    Migrated automatically — no longer editable.
                  </FieldDescription>
                </Field>

                <Field data-invalid={!!errors.kickoffDate}>
                  <FieldLabel htmlFor="kickoffDate">Kickoff date</FieldLabel>
                  <Input
                    id="kickoffDate"
                    type="date"
                    aria-invalid={!!errors.kickoffDate}
                    {...register("kickoffDate")}
                  />
                  {errors.kickoffDate && (
                    <FieldError>{errors.kickoffDate.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <div className={styles.footer}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </section>
  );
};
