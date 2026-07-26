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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import themeLog from "@/styles/themes/history/THEME-LOG.json";

import { componentsGalleryPageStyles as styles } from "./ComponentsGalleryPage.styles";
import {
  ColorSwatch,
  GallerySection,
  ThemeHistoryPanel,
  type ThemeLogEntry,
} from "./components";
import type { GalleryNavItem } from "./types";

const NAV_ITEMS: GalleryNavItem[] = [
  { id: "foundations", label: "Foundations" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons & Badges" },
  { id: "forms", label: "Form Inputs" },
  { id: "feedback", label: "Feedback" },
  { id: "theme-history", label: "Theme History" },
];

const COLOR_TOKENS: {
  label: string;
  token: string;
  bg: string;
  fg?: string;
}[] = [
  {
    label: "Background",
    token: "--background",
    bg: "bg-background",
    fg: "text-foreground",
  },
  {
    label: "Foreground",
    token: "--foreground",
    bg: "bg-foreground",
    fg: "text-background",
  },
  {
    label: "Primary",
    token: "--primary",
    bg: "bg-primary",
    fg: "text-primary-foreground",
  },
  {
    label: "Secondary",
    token: "--secondary",
    bg: "bg-secondary",
    fg: "text-secondary-foreground",
  },
  {
    label: "Accent",
    token: "--accent",
    bg: "bg-accent",
    fg: "text-accent-foreground",
  },
  { label: "Card", token: "--card", bg: "bg-card", fg: "text-card-foreground" },
  {
    label: "Muted",
    token: "--muted",
    bg: "bg-muted",
    fg: "text-muted-foreground",
  },
  {
    label: "Destructive",
    token: "--destructive",
    bg: "bg-destructive",
    fg: "text-destructive-foreground",
  },
  {
    label: "Success",
    token: "--success",
    bg: "bg-success",
    fg: "text-success-foreground",
  },
  {
    label: "Warning",
    token: "--warning",
    bg: "bg-warning",
    fg: "text-warning-foreground",
  },
  { label: "Info", token: "--info", bg: "bg-info", fg: "text-info-foreground" },
  { label: "Chart 1", token: "--chart-1", bg: "bg-chart-1" },
  { label: "Chart 2", token: "--chart-2", bg: "bg-chart-2" },
  { label: "Chart 3", token: "--chart-3", bg: "bg-chart-3" },
  {
    label: "Sidebar",
    token: "--sidebar",
    bg: "bg-sidebar",
    fg: "text-sidebar-foreground",
  },
];

export function ComponentsGalleryPage() {
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
          <h1 className={styles.title}>Components Gallery</h1>
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
            {COLOR_TOKENS.map((c) => (
              <ColorSwatch
                key={c.token}
                label={c.label}
                token={c.token}
                bgClassName={c.bg}
                textClassName={c.fg}
              />
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
          description="Input, Label, and Textarea primitives inside a Card."
        >
          <Card>
            <CardHeader>
              <CardTitle>Example form</CardTitle>
              <CardDescription>
                Not wired to any state — purely a visual reference.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <Label htmlFor="gallery-name">Name</Label>
                  <Input id="gallery-name" placeholder="Jane Doe" />
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="gallery-message">Message</Label>
                  <Textarea
                    id="gallery-message"
                    placeholder="Type something..."
                  />
                </div>
              </div>
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
          <ThemeHistoryPanel entries={themeLog as ThemeLogEntry[]} />
        </GallerySection>
      </main>
    </div>
  );
}
