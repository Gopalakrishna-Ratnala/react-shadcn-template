import { PencilIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";

import { PageHeader, StatusBadge } from "@/components/blocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/constants";

import {
  activityListStyles,
  descriptionBodyStyles,
  headerActionsStyles,
  metaCardBodyStyles,
  metaLabelStyles,
  metaListStyles,
  metaRowStyles,
  overviewGridStyles,
  overviewMainStyles,
  ownerNameStyles,
  ownerRoleStyles,
  ownerRowStyles,
  pageStyles,
  placeholderStyles,
  propertyItemStyles,
  propertyLabelStyles,
  propertyListStyles,
  propertyValueStyles,
  tagRowStyles,
} from "./ProjectDetailPage.styles";
import type { DetailActivity, DetailProperty } from "./types";

const PROPERTIES: DetailProperty[] = [
  { label: "Client", value: "Aurora Health" },
  { label: "Project code", value: "PRJ-2026-014" },
  { label: "Priority", value: "High" },
  { label: "Engagement type", value: "Fixed scope" },
  { label: "Start date", value: "Apr 8, 2026" },
  { label: "Target delivery", value: "Aug 29, 2026" },
];

const TAGS = ["Healthcare", "Design system", "Mobile", "Accessibility"];

const ACTIVITY: DetailActivity[] = [
  { id: "a1", actor: "Daniel Cho", summary: "submitted the onboarding flow for review", timestamp: "5h ago" },
  { id: "a2", actor: "Priya Sharma", summary: "updated the component inventory", timestamp: "Yesterday" },
  { id: "a3", actor: "Meera Iyer", summary: "left 4 comments on the dashboard spec", timestamp: "2 days ago" },
];

export function ProjectDetailPage() {
  return (
    <section className={pageStyles} aria-label="Project detail">
      <PageHeader
        breadcrumbs={[
          { label: "Projects", href: ROUTES.PREVIEW_LISTING },
          { label: "Aurora Care Portal" },
        ]}
        title="Aurora Care Portal"
        action={
          <nav className={headerActionsStyles} aria-label="Project actions">
            <Dialog>
              <DialogTrigger
                render={
                  <Button type="button" variant="destructive">
                    <Trash2Icon />
                    Delete
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete this project?</DialogTitle>
                  <DialogDescription>
                    This permanently removes “Aurora Care Portal” and all of its activity. This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button type="button" variant="outline">Keep project</Button>} />
                  <Button type="button" variant="destructive">
                    Delete project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link to={ROUTES.PREVIEW_FORM} className={buttonVariants({ variant: "secondary" })}>
              <PencilIcon />
              Edit
            </Link>
            <Button type="button">Mark as complete</Button>
          </nav>
        }
      />

      <StatusBadge tone="warning" label="In review" />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <section className={overviewGridStyles} aria-label="Project overview">
            <section className={overviewMainStyles} aria-label="Description and properties">
              <Card>
                <CardHeader>
                  <CardTitle>About this project</CardTitle>
                </CardHeader>
                <CardContent className={descriptionBodyStyles}>
                  <p>
                    Aurora Health is rebuilding its patient-facing care portal on the Divami design
                    system. The engagement covers a component audit, a themable design foundation,
                    and a production-ready React implementation of the onboarding and scheduling
                    flows.
                  </p>
                  <p>
                    The team is currently validating the theming layer against Aurora&apos;s brand
                    palette before handing the first two flows to their engineering group for
                    integration.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={propertyListStyles}>
                    {PROPERTIES.map((property) => (
                      <li key={property.label} className={propertyItemStyles}>
                        <p className={propertyLabelStyles}>{property.label}</p>
                        <p className={propertyValueStyles}>{property.value}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className={metaCardBodyStyles}>
                <section className={ownerRowStyles} aria-label="Project owner">
                  <Avatar>
                    <AvatarFallback>DC</AvatarFallback>
                  </Avatar>
                  <p className={propertyItemStyles}>
                    <strong className={ownerNameStyles}>Daniel Cho</strong>
                    <small className={ownerRoleStyles}>Project lead</small>
                  </p>
                </section>

                <Separator />

                <dl className={metaListStyles}>
                  <dt className={metaLabelStyles}>Created</dt>
                  <dd>
                    <time dateTime="2026-04-08">Apr 8, 2026</time>
                  </dd>
                  <dt className={metaLabelStyles}>Last updated</dt>
                  <dd>
                    <time dateTime="2026-07-17">Jul 17, 2026</time>
                  </dd>
                  <dt className={metaLabelStyles}>Team size</dt>
                  <dd>6 people</dd>
                </dl>

                <Separator />

                <section aria-label="Tags">
                  <ul className={tagRowStyles}>
                    {TAGS.map((tag) => (
                      <li key={tag}>
                        <Badge variant="secondary">{tag}</Badge>
                      </li>
                    ))}
                  </ul>
                </section>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={activityListStyles}>
                {ACTIVITY.map((entry) => (
                  <li key={entry.id} className={metaRowStyles}>
                    <p>
                      <strong className={ownerNameStyles}>{entry.actor}</strong> {entry.summary}
                    </p>
                    <small className={metaLabelStyles}>{entry.timestamp}</small>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={placeholderStyles}>
                Project settings would appear here — visibility, integrations, and archiving.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

export default ProjectDetailPage;
