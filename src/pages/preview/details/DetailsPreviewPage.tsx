import type { ReactElement } from "react";

import { PageHeader, StatusBadge } from "@/components/blocks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROJECT_STATUS_BADGE_MAP } from "@/constants";

import { DETAILS_ACTIVITY, DETAILS_RECORD } from "./DetailsPreviewPage.data";
import { detailsPreviewPageStyles as styles } from "./DetailsPreviewPage.styles";

export const DetailsPreviewPage = (): ReactElement => {
  const record = DETAILS_RECORD;

  return (
    <section className={styles.wrapper}>
      <PageHeader
        breadcrumbItems={[
          { label: "Preview" },
          { label: "Projects", href: "/preview/listing" },
          { label: record.title },
        ]}
        title={record.title}
        description={record.client}
        actions={
          <>
            <StatusBadge
              status={PROJECT_STATUS_BADGE_MAP[record.status]}
              label={record.status}
            />
            <Button variant="secondary">Edit</Button>
            <Button>Mark complete</Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive">Delete</Button>}
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes &ldquo;{record.title}&rdquo; and
                    all of its activity. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive">
                    Delete project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className={styles.overviewGrid}>
            <div className={styles.descriptionCard}>
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className={styles.descriptionContent}>
                  <p>{record.description}</p>
                  <dl className={styles.propertiesList}>
                    {record.properties.map((property) => (
                      <div key={property.label}>
                        <dt className={styles.propertyLabel}>
                          {property.label}
                        </dt>
                        <dd className={styles.propertyValue}>
                          {property.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className={styles.metadataCard}>
                <div className={styles.ownerRow}>
                  <Avatar>
                    <AvatarFallback>{record.ownerInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={styles.ownerName}>{record.ownerName}</p>
                    <p className={styles.ownerRole}>Project owner</p>
                  </div>
                </div>

                <Separator />

                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Created</span>
                  <time dateTime={record.createdAt}>{record.createdAt}</time>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Updated</span>
                  <time dateTime={record.updatedAt}>{record.updatedAt}</time>
                </div>

                <Separator />

                <div className={styles.tagsRow}>
                  {record.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className={styles.activityList}>
                {DETAILS_ACTIVITY.map((entry) => (
                  <li key={entry.id} className={styles.activityRow}>
                    <p>
                      <span className={styles.activityActor}>
                        {entry.actorName}
                      </span>{" "}
                      {entry.summary}
                    </p>
                    <time
                      dateTime={entry.timestamp}
                      className={styles.metaLabel}
                    >
                      {entry.timestamp}
                    </time>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className={styles.placeholderCard}>
              Project-level settings will appear here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};
