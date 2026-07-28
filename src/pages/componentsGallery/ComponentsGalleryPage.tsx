import type { ReactElement } from "react";

import { ThemeToggle } from "@/components/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import themeLog from "@/styles/themes/history/THEME-LOG.json";

import {
  ColorSwatch,
  GallerySection,
  ThemeHistoryPanel,
  themeLogSchema,
  type ColorSwatchProps,
} from "./components";
import { componentsGalleryPageStyles as styles } from "./ComponentsGalleryPage.styles";

import type { GalleryNavItem } from "./types";

// THEME-LOG.json is a hand-edited file (see styling/shadcn/03-theme-versioning.md) -
// validate its shape at runtime rather than trusting an unsafe `as` cast.
const THEME_LOG_ENTRIES = themeLogSchema.parse(themeLog);

const NAV_ITEMS: GalleryNavItem[] = [
  { id: "foundations", label: "Foundations" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons & Badges" },
  { id: "forms", label: "Form Inputs" },
  { id: "feedback", label: "Feedback" },
  { id: "theme-history", label: "Theme History" },
];

const COLOR_TOKENS: ColorSwatchProps[] = [
  {
    label: "Background",
    token: "--background",
    bgClassName: "bg-background",
    textClassName: "text-foreground",
  },
  {
    label: "Foreground",
    token: "--foreground",
    bgClassName: "bg-foreground",
    textClassName: "text-background",
  },
  {
    label: "Primary",
    token: "--primary",
    bgClassName: "bg-primary",
    textClassName: "text-primary-foreground",
  },
  {
    label: "Secondary",
    token: "--secondary",
    bgClassName: "bg-secondary",
    textClassName: "text-secondary-foreground",
  },
  {
    label: "Accent",
    token: "--accent",
    bgClassName: "bg-accent",
    textClassName: "text-accent-foreground",
  },
  {
    label: "Card",
    token: "--card",
    bgClassName: "bg-card",
    textClassName: "text-card-foreground",
  },
  {
    label: "Muted",
    token: "--muted",
    bgClassName: "bg-muted",
    textClassName: "text-muted-foreground",
  },
  {
    label: "Destructive",
    token: "--destructive",
    bgClassName: "bg-destructive",
    textClassName: "text-destructive-foreground",
  },
  {
    label: "Success",
    token: "--success",
    bgClassName: "bg-success",
    textClassName: "text-success-foreground",
  },
  {
    label: "Warning",
    token: "--warning",
    bgClassName: "bg-warning",
    textClassName: "text-warning-foreground",
  },
  {
    label: "Info",
    token: "--info",
    bgClassName: "bg-info",
    textClassName: "text-info-foreground",
  },
  { label: "Chart 1", token: "--chart-1", bgClassName: "bg-chart-1" },
  { label: "Chart 2", token: "--chart-2", bgClassName: "bg-chart-2" },
  { label: "Chart 3", token: "--chart-3", bgClassName: "bg-chart-3" },
  {
    label: "Sidebar",
    token: "--sidebar",
    bgClassName: "bg-sidebar",
    textClassName: "text-sidebar-foreground",
  },
];

export const ComponentsGalleryPage = (): ReactElement => {
  return (
    <div className={styles.page}>
      <nav className={styles.nav} aria-label="Components gallery sections">
        <p className={styles.navTitle}>Sections</p>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className={styles.navLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Components Gallery</h1>
            <ThemeToggle />
          </div>
          <p className={styles.subtitle}>
            A living reference of this project's design tokens and shadcn/ui
            primitives, styled entirely from{" "}
            <code>src/styles/themes/theme.css</code>.
          </p>
        </header>

        <GallerySection
          id="foundations"
          title="Foundations"
          description="Semantic color tokens, read live from the active theme."
        >
          <div className={styles.swatchGrid}>
            {COLOR_TOKENS.map((colorToken) => (
              <ColorSwatch key={colorToken.token} {...colorToken} />
            ))}
          </div>
        </GallerySection>

        <GallerySection
          id="typography"
          title="Typography"
          description="Type scale defined in theme.css, consumed via CSS variables directly (not yet bridged into Tailwind's utility-generating theme layer — see the note in src/index.css)."
        >
          <div className={styles.typographySample}>
            <p className={styles.typographyHero}>Hero / Display</p>
            <p className={styles.typographyHeading}>Section heading</p>
            <p className={styles.typographyBody}>
              Body text at the base size — this is what most paragraph content
              should use.
            </p>
            <p className={styles.typographyHelper}>
              Secondary / helper text, smaller and muted.
            </p>
          </div>
        </GallerySection>

        <GallerySection
          id="buttons"
          title="Buttons & Badges"
          description="Every Button variant, and Badge used for status indicators."
        >
          <div className={styles.row}>
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className={styles.row}>
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </GallerySection>

        <GallerySection
          id="forms"
          title="Form Inputs"
          description="Field/FieldGroup/FieldLabel composition (the correct shadcn/ui pattern) wrapping Input and Textarea."
        >
          <Card>
            <CardHeader>
              <CardTitle>Example form</CardTitle>
              <CardDescription>
                Not wired to any state — purely a visual reference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="gallery-name">Name</FieldLabel>
                  <Input id="gallery-name" placeholder="Jane Doe" />
                  <FieldDescription>
                    Shown alongside your message.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="gallery-message">Message</FieldLabel>
                  <Textarea
                    id="gallery-message"
                    placeholder="Type something..."
                  />
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </GallerySection>

        <GallerySection
          id="feedback"
          title="Feedback"
          description="Alert in both its variants."
        >
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>
              This is a default alert, used for neutral information.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              This is a destructive alert, used for errors.
            </AlertDescription>
          </Alert>
        </GallerySection>

        <GallerySection
          id="theme-history"
          title="Theme History"
          description="Every theme candidate ever created, read directly from THEME-LOG.json — see styling/shadcn/03-theme-versioning.md."
        >
          <ThemeHistoryPanel entries={THEME_LOG_ENTRIES} />
        </GallerySection>
      </main>
    </div>
  );
};
