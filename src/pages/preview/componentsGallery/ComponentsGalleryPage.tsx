import { useState } from "react";

import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowRightIcon,
  BellIcon,
  BoldIcon,
  CircleCheckIcon,
  CreditCardIcon,
  DownloadIcon,
  FileTextIcon,
  FolderIcon,
  HomeIcon,
  ImageIcon,
  InboxIcon,
  InfoIcon,
  ItalicIcon,
  LayoutDashboardIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  TrashIcon,
  TriangleAlertIcon,
  UnderlineIcon,
  UsersIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Attachment,
  AttachmentActions,
  AttachmentAction,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DirectionProvider } from "@/components/ui/direction";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorSwatch, Specimen, ThemeToggle } from "@/components/shared";
import { useResolvedToken, useToastPreview } from "@/hooks";

import * as styles from "./ComponentsGalleryPage.styles";
import type { DateRange } from "react-day-picker";

import type {
  ChannelSlice,
  ChatMessage,
  InvoiceRow,
  NavLink,
  TokenGroup,
} from "./types";

const NAV_LINKS: NavLink[] = [
  { id: "foundations", label: "1 · Foundations" },
  { id: "typography", label: "2 · Typography & labels" },
  { id: "buttons", label: "3 · Buttons & actions" },
  { id: "form-inputs", label: "4 · Form fields — inputs" },
  { id: "form-choice", label: "5 · Form fields — choice" },
  { id: "calendar", label: "6 · Date & calendar" },
  { id: "feedback", label: "7 · Feedback & status" },
  { id: "overlays", label: "8 · Overlays" },
  { id: "menus", label: "9 · Menus & command" },
  { id: "navigation", label: "10 · Navigation" },
  { id: "data-display", label: "11 · Data display" },
  { id: "media", label: "12 · Media & files" },
  { id: "messaging", label: "13 · Messaging" },
];

const COLOR_GROUPS: TokenGroup[] = [
  {
    title: "Surfaces & text",
    tokens: [
      { label: "background", cssVariable: "--background", swatchClassName: "bg-background" },
      { label: "foreground", cssVariable: "--foreground", swatchClassName: "bg-foreground" },
      { label: "card", cssVariable: "--card", swatchClassName: "bg-card" },
      { label: "card-foreground", cssVariable: "--card-foreground", swatchClassName: "bg-card-foreground" },
      { label: "popover", cssVariable: "--popover", swatchClassName: "bg-popover" },
      { label: "popover-foreground", cssVariable: "--popover-foreground", swatchClassName: "bg-popover-foreground" },
    ],
  },
  {
    title: "Brand & actions",
    tokens: [
      { label: "primary", cssVariable: "--primary", swatchClassName: "bg-primary" },
      { label: "primary-foreground", cssVariable: "--primary-foreground", swatchClassName: "bg-primary-foreground" },
      { label: "secondary", cssVariable: "--secondary", swatchClassName: "bg-secondary" },
      { label: "secondary-foreground", cssVariable: "--secondary-foreground", swatchClassName: "bg-secondary-foreground" },
      { label: "accent", cssVariable: "--accent", swatchClassName: "bg-accent" },
      { label: "accent-foreground", cssVariable: "--accent-foreground", swatchClassName: "bg-accent-foreground" },
      { label: "muted", cssVariable: "--muted", swatchClassName: "bg-muted" },
      { label: "muted-foreground", cssVariable: "--muted-foreground", swatchClassName: "bg-muted-foreground" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { label: "destructive", cssVariable: "--destructive", swatchClassName: "bg-destructive" },
      { label: "destructive-foreground", cssVariable: "--destructive-foreground", swatchClassName: "bg-destructive-foreground" },
      { label: "success", cssVariable: "--success", swatchClassName: "bg-success" },
      { label: "success-foreground", cssVariable: "--success-foreground", swatchClassName: "bg-success-foreground" },
      { label: "warning", cssVariable: "--warning", swatchClassName: "bg-warning" },
      { label: "warning-foreground", cssVariable: "--warning-foreground", swatchClassName: "bg-warning-foreground" },
      { label: "info", cssVariable: "--info", swatchClassName: "bg-info" },
      { label: "info-foreground", cssVariable: "--info-foreground", swatchClassName: "bg-info-foreground" },
    ],
  },
  {
    title: "Lines & focus",
    tokens: [
      { label: "border", cssVariable: "--border", swatchClassName: "bg-border" },
      { label: "input", cssVariable: "--input", swatchClassName: "bg-input" },
      { label: "ring", cssVariable: "--ring", swatchClassName: "bg-ring" },
    ],
  },
  {
    title: "Charts",
    tokens: [
      { label: "chart-1", cssVariable: "--chart-1", swatchClassName: "swatch-chart-1" },
      { label: "chart-2", cssVariable: "--chart-2", swatchClassName: "swatch-chart-2" },
      { label: "chart-3", cssVariable: "--chart-3", swatchClassName: "swatch-chart-3" },
      { label: "chart-4", cssVariable: "--chart-4", swatchClassName: "swatch-chart-4" },
      { label: "chart-5", cssVariable: "--chart-5", swatchClassName: "swatch-chart-5" },
    ],
  },
  {
    title: "Sidebar",
    tokens: [
      { label: "sidebar", cssVariable: "--sidebar", swatchClassName: "bg-sidebar" },
      { label: "sidebar-foreground", cssVariable: "--sidebar-foreground", swatchClassName: "bg-sidebar-foreground" },
      { label: "sidebar-primary", cssVariable: "--sidebar-primary", swatchClassName: "bg-sidebar-primary" },
      { label: "sidebar-primary-foreground", cssVariable: "--sidebar-primary-foreground", swatchClassName: "bg-sidebar-primary-foreground" },
      { label: "sidebar-accent", cssVariable: "--sidebar-accent", swatchClassName: "bg-sidebar-accent" },
      { label: "sidebar-accent-foreground", cssVariable: "--sidebar-accent-foreground", swatchClassName: "bg-sidebar-accent-foreground" },
      { label: "sidebar-border", cssVariable: "--sidebar-border", swatchClassName: "bg-sidebar-border" },
      { label: "sidebar-ring", cssVariable: "--sidebar-ring", swatchClassName: "bg-sidebar-ring" },
    ],
  },
];

const TYPE_SCALE = [
  { token: "--text-4xl", className: styles.text4xlStyles, sample: "Design that ships" },
  { token: "--text-3xl", className: styles.text3xlStyles, sample: "Design that ships" },
  { token: "--text-2xl", className: styles.text2xlStyles, sample: "Design that ships" },
  { token: "--text-xl", className: styles.textXlStyles, sample: "Design that ships" },
  { token: "--text-lg", className: styles.textLgStyles, sample: "Design that ships" },
  { token: "--text-base", className: styles.textBaseStyles, sample: "Design that ships" },
  { token: "--text-sm", className: styles.textSmStyles, sample: "Design that ships" },
  { token: "--text-xs", className: styles.textXsStyles, sample: "Design that ships" },
];

const WEIGHTS = [
  { label: "normal", value: "400", className: styles.weightNormalStyles },
  { label: "medium", value: "500", className: styles.weightMediumStyles },
  { label: "semibold", value: "600", className: styles.weightSemiboldStyles },
  { label: "bold", value: "700", className: styles.weightBoldStyles },
];

const RADII = [
  { token: "--radius-sm", className: styles.radiusBoxSmStyles },
  { token: "--radius", className: styles.radiusBoxMdStyles },
  { token: "--radius-lg", className: styles.radiusBoxLgStyles },
  { token: "--radius-full", className: styles.radiusBoxFullStyles },
];

const SHADOWS = [
  { token: "--shadow-sm", className: styles.shadowBoxSmStyles },
  { token: "--shadow-md", className: styles.shadowBoxMdStyles },
  { token: "--shadow-lg", className: styles.shadowBoxLgStyles },
  { token: "--shadow-focus", className: styles.shadowBoxFocusStyles },
];

const FRAMEWORKS = [
  "Next.js",
  "Remix",
  "Astro",
  "SvelteKit",
  "Nuxt",
  "Vite + React",
];

const INVOICES: InvoiceRow[] = [
  { id: "NST-1042", client: "Aurora Labs", service: "Brand system", status: "Paid", amount: "$18,400" },
  { id: "NST-1043", client: "Meridian AI", service: "Design sprint", status: "Pending", amount: "$9,750" },
  { id: "NST-1044", client: "Northwind", service: "Design ops retainer", status: "Overdue", amount: "$12,000" },
  { id: "NST-1045", client: "Helix Health", service: "Research study", status: "Paid", amount: "$6,300" },
];

const TRAFFIC = [
  { month: "Jan", organic: 220, referral: 120 },
  { month: "Feb", organic: 260, referral: 140 },
  { month: "Mar", organic: 300, referral: 160 },
  { month: "Apr", organic: 280, referral: 190 },
  { month: "May", organic: 340, referral: 210 },
  { month: "Jun", organic: 380, referral: 240 },
];

const ENGAGEMENT = [
  { week: "W1", sessions: 1200 },
  { week: "W2", sessions: 1680 },
  { week: "W3", sessions: 1520 },
  { week: "W4", sessions: 2040 },
  { week: "W5", sessions: 2380 },
  { week: "W6", sessions: 2610 },
];

const CHANNELS: ChannelSlice[] = [
  { channel: "Organic", value: 480, fill: "var(--chart-1)" },
  { channel: "Referral", value: 240, fill: "var(--chart-2)" },
  { channel: "Social", value: 180, fill: "var(--chart-3)" },
  { channel: "Email", value: 120, fill: "var(--chart-4)" },
  { channel: "Direct", value: 90, fill: "var(--chart-5)" },
];

const CONVERSATION: ChatMessage[] = [
  { id: "m1", author: "Priya (Design lead)", text: "The Aurora dashboard tokens are merged — take a look at the gallery.", time: "9:32 AM", align: "start" },
  { id: "m2", author: "You", text: "Looks sharp. Can we bump the primary a touch warmer?", time: "9:34 AM", align: "end" },
  { id: "m3", author: "Priya (Design lead)", text: "Done — pushed a new theme.css. Everything reskinned instantly.", time: "9:36 AM", align: "start" },
  { id: "m4", author: "You", text: "Perfect. Shipping the preview now.", time: "9:37 AM", align: "end" },
];

const BAR_CONFIG: ChartConfig = {
  organic: { label: "Organic search", color: "var(--chart-1)" },
  referral: { label: "Referral", color: "var(--chart-2)" },
};

const AREA_CONFIG: ChartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
};

const PIE_CONFIG: ChartConfig = {
  Organic: { label: "Organic", color: "var(--chart-1)" },
  Referral: { label: "Referral", color: "var(--chart-2)" },
  Social: { label: "Social", color: "var(--chart-3)" },
  Email: { label: "Email", color: "var(--chart-4)" },
  Direct: { label: "Direct", color: "var(--chart-5)" },
};

function badgeStatusVariant(
  status: InvoiceRow["status"],
): "secondary" | "outline" | "destructive" {
  if (status === "Paid") return "secondary";
  if (status === "Pending") return "outline";
  return "destructive";
}

export function ComponentsGalleryPage() {
  const strokeWidth = useResolvedToken("--icon-stroke-width");
  const toastPreview = useToastPreview();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    new Date(2026, 6, 21),
  );
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: new Date(2026, 6, 14),
    to: new Date(2026, 6, 21),
  });

  return (
    <TooltipProvider>
      <main className={styles.pageRootStyles}>
        <header className={styles.topBarStyles}>
          <section className={styles.topBarInnerStyles}>
            <section className={styles.topBarTitleWrapStyles}>
              <small className={styles.topBarKickerStyles}>
                Nova Studio · AI product design
              </small>
              <strong className={styles.topBarTitleStyles}>
                Design system — components
              </strong>
              <small className={styles.topBarHelperStyles}>
                This page reflects the currently active theme. Toggle the mode or
                edit theme.css and every element re-skins.
              </small>
            </section>
            <section className={styles.topBarActionsStyles}>
              <ThemeToggle />
            </section>
          </section>
        </header>

        <section className={styles.layoutStyles}>
          <aside className={styles.navAsideStyles} aria-label="Section navigation">
            <p className={styles.navHeadingStyles}>Sections</p>
            <nav>
              <ul className={styles.navListStyles}>
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a className={styles.navLinkStyles} href={`#${link.id}`}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className={styles.mainStyles}>
            {/* ============ 1. FOUNDATIONS ============ */}
            <section id="foundations" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Foundations</small>
                <h2 className={styles.sectionTitleStyles}>Design tokens</h2>
                <p className={styles.sectionDescStyles}>
                  Every semantic token in the theme contract, resolved live from
                  the active theme.css.
                </p>
              </header>

              {COLOR_GROUPS.map((group) => (
                <section key={group.title} className={styles.subGroupStyles}>
                  <h3 className={styles.subGroupTitleStyles}>{group.title}</h3>
                  <ul className={styles.swatchGridStyles}>
                    {group.tokens.map((token) => (
                      <li key={token.cssVariable}>
                        <ColorSwatch
                          label={token.label}
                          cssVariable={token.cssVariable}
                          swatchClassName={token.swatchClassName}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <section className={styles.subGroupStyles}>
                <h3 className={styles.subGroupTitleStyles}>Typography scale</h3>
                <ul className={styles.typeScaleListStyles}>
                  {TYPE_SCALE.map((step) => (
                    <li key={step.token} className={styles.typeRowStyles}>
                      <p className={step.className}>{step.sample}</p>
                      <code className={styles.typeTokenStyles}>{step.token}</code>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.subGroupStyles}>
                <h3 className={styles.subGroupTitleStyles}>Font weights</h3>
                <ul className={styles.colStyles}>
                  {WEIGHTS.map((weight) => (
                    <li key={weight.value} className={styles.weightRowStyles}>
                      <p className={weight.className}>
                        Nova Studio — {weight.label}
                      </p>
                      <code className={styles.typeTokenStyles}>
                        {weight.value}
                      </code>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.subGroupStyles}>
                <h3 className={styles.subGroupTitleStyles}>Radius</h3>
                <ul className={styles.sampleGridStyles}>
                  {RADII.map((radius) => (
                    <li key={radius.token} className={styles.sampleCellStyles}>
                      <figure
                        className={radius.className}
                        aria-hidden="true"
                      />
                      <code className={styles.sampleCaptionStyles}>
                        {radius.token}
                      </code>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.subGroupStyles}>
                <h3 className={styles.subGroupTitleStyles}>Elevation</h3>
                <ul className={styles.sampleGridStyles}>
                  {SHADOWS.map((shadow) => (
                    <li key={shadow.token} className={styles.sampleCellStyles}>
                      <figure
                        className={shadow.className}
                        aria-hidden="true"
                      />
                      <code className={styles.sampleCaptionStyles}>
                        {shadow.token}
                      </code>
                    </li>
                  ))}
                </ul>
              </section>

              <section className={styles.subGroupStyles}>
                <h3 className={styles.subGroupTitleStyles}>
                  Icon sizes · stroke width {strokeWidth || "—"}
                </h3>
                <ul className={styles.iconRowStyles}>
                  <li className={styles.iconCellStyles}>
                    <Icon icon={SparklesIcon} size="sm" />
                    <code className={styles.iconCaptionStyles}>sm</code>
                  </li>
                  <li className={styles.iconCellStyles}>
                    <Icon icon={SparklesIcon} size="md" />
                    <code className={styles.iconCaptionStyles}>md</code>
                  </li>
                  <li className={styles.iconCellStyles}>
                    <Icon icon={SparklesIcon} size="lg" />
                    <code className={styles.iconCaptionStyles}>lg</code>
                  </li>
                </ul>
              </section>
            </section>

            {/* ============ 2. TYPOGRAPHY & LABELS ============ */}
            <section id="typography" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 2</small>
                <h2 className={styles.sectionTitleStyles}>Typography & labels</h2>
                <p className={styles.sectionDescStyles}>
                  Label, kbd and marker primitives.
                </p>
              </header>
              <section className={styles.specimenGridStyles}>
                <Specimen title="Label" description="Associated with a field">
                  <section className={styles.fieldStackStyles}>
                    <Label htmlFor="team-name">Workspace name</Label>
                    <Input id="team-name" defaultValue="Nova Studio" />
                  </section>
                </Specimen>
                <Specimen title="Kbd" description="Keyboard shortcut chips">
                  <section className={styles.kbdRowStyles}>
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                    </KbdGroup>
                    <KbdGroup>
                      <Kbd>⇧</Kbd>
                      <Kbd>↵</Kbd>
                    </KbdGroup>
                    <KbdGroup>
                      <Kbd>Esc</Kbd>
                    </KbdGroup>
                  </section>
                </Specimen>
                <Specimen title="Marker" description="Emphasized inline markers">
                  <section className={styles.markerColStyles}>
                    <Marker>
                      <MarkerIcon>
                        <Icon icon={CircleCheckIcon} size="sm" />
                      </MarkerIcon>
                      <MarkerContent>Research complete</MarkerContent>
                    </Marker>
                    <Marker variant="separator">
                      <MarkerContent>Today</MarkerContent>
                    </Marker>
                    <Marker variant="border">
                      <MarkerContent>In review</MarkerContent>
                    </Marker>
                  </section>
                </Specimen>
              </section>
            </section>

            {/* ============ 3. BUTTONS & ACTIONS ============ */}
            <section id="buttons" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 3</small>
                <h2 className={styles.sectionTitleStyles}>Buttons & actions</h2>
                <p className={styles.sectionDescStyles}>
                  Button, button-group, toggle and toggle-group.
                </p>
              </header>
              <section className={styles.specimenGridStyles}>
                <Specimen title="Variants">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                </Specimen>
                <Specimen title="Sizes">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                </Specimen>
                <Specimen
                  title="States"
                  description="Hover & focus are interactive"
                >
                  <Button>Default</Button>
                  <Button disabled>Disabled</Button>
                  <Button disabled>
                    <Spinner className="size-4" />
                    Saving…
                  </Button>
                </Specimen>
                <Specimen title="With icons">
                  <Button>
                    <Icon icon={PlusIcon} size="sm" />
                    New project
                  </Button>
                  <Button variant="outline">
                    Continue
                    <Icon icon={ArrowRightIcon} size="sm" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Settings">
                    <Icon icon={SettingsIcon} size="sm" />
                  </Button>
                </Specimen>
                <Specimen title="Button group" description="Horizontal + text">
                  <ButtonGroup>
                    <Button variant="outline">
                      <Icon icon={BoldIcon} size="sm" />
                    </Button>
                    <Button variant="outline">
                      <Icon icon={ItalicIcon} size="sm" />
                    </Button>
                    <Button variant="outline">
                      <Icon icon={UnderlineIcon} size="sm" />
                    </Button>
                    <ButtonGroupSeparator />
                    <ButtonGroupText>Aa</ButtonGroupText>
                  </ButtonGroup>
                </Specimen>
                <Specimen title="Button group" description="Vertical">
                  <ButtonGroup orientation="vertical">
                    <Button variant="outline">Top</Button>
                    <Button variant="outline">Middle</Button>
                    <Button variant="outline">Bottom</Button>
                  </ButtonGroup>
                </Specimen>
                <Specimen title="Toggle" description="off · on · disabled">
                  <Toggle aria-label="Bold, off">
                    <Icon icon={BoldIcon} size="sm" />
                  </Toggle>
                  <Toggle defaultPressed aria-label="Italic, on">
                    <Icon icon={ItalicIcon} size="sm" />
                  </Toggle>
                  <Toggle disabled aria-label="Underline, disabled">
                    <Icon icon={UnderlineIcon} size="sm" />
                  </Toggle>
                </Specimen>
                <Specimen title="Toggle group" description="Single select">
                  <ToggleGroup defaultValue={["center"]} variant="outline" spacing={0}>
                    <ToggleGroupItem value="left" aria-label="Align left">
                      <Icon icon={AlignLeftIcon} size="sm" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                      <Icon icon={AlignCenterIcon} size="sm" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                      <Icon icon={AlignRightIcon} size="sm" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Specimen>
                <Specimen title="Toggle group" description="Multi select">
                  <ToggleGroup
                    defaultValue={["bold", "italic"]}
                    multiple
                    variant="outline"
                  >
                    <ToggleGroupItem value="bold" aria-label="Bold">
                      <Icon icon={BoldIcon} size="sm" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Italic">
                      <Icon icon={ItalicIcon} size="sm" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="underline" aria-label="Underline">
                      <Icon icon={UnderlineIcon} size="sm" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Specimen>
              </section>
            </section>

            {/* ============ 4. FORM FIELDS — INPUTS ============ */}
            <section id="form-inputs" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 4</small>
                <h2 className={styles.sectionTitleStyles}>Form fields — inputs</h2>
                <p className={styles.sectionDescStyles}>
                  Input, input-group, input-otp, textarea, native-select, select,
                  combobox and the field wrapper.
                </p>
              </header>
              <section className={styles.specimenGridStyles}>
                <Specimen title="Input" description="Default · leading icon">
                  <section className={styles.colStyles}>
                    <Input
                      className={styles.constrainedStyles}
                      placeholder="you@novastudio.com"
                    />
                    <InputGroup className={styles.constrainedStyles}>
                      <InputGroupAddon align="inline-start">
                        <Icon icon={SearchIcon} size="sm" />
                      </InputGroupAddon>
                      <InputGroupInput placeholder="Search projects…" />
                    </InputGroup>
                  </section>
                </Specimen>
                <Specimen title="Input" description="Disabled · error">
                  <section className={styles.colStyles}>
                    <Input
                      className={styles.constrainedStyles}
                      defaultValue="Locked field"
                      disabled
                    />
                    <section className={styles.fieldStackStyles}>
                      <Input
                        aria-invalid
                        aria-describedby="email-error"
                        defaultValue="not-an-email"
                      />
                      <small id="email-error" className={styles.errorTextStyles}>
                        Enter a valid email address.
                      </small>
                    </section>
                  </section>
                </Specimen>
                <Specimen title="Input group" description="Prefix + suffix">
                  <InputGroup className={styles.constrainedMdStyles}>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>https://</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="novastudio" />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>.com</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </Specimen>
                <Specimen title="Input OTP" description="Filled · empty">
                  <section className={styles.colStyles}>
                    <InputOTP maxLength={6} defaultValue="428913">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <InputOTP maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </section>
                </Specimen>
                <Specimen title="Textarea" description="Default · disabled">
                  <section className={styles.colStyles}>
                    <Textarea
                      className={styles.constrainedMdStyles}
                      placeholder="Describe the design brief…"
                    />
                    <Textarea
                      className={styles.constrainedMdStyles}
                      defaultValue="Locked notes"
                      disabled
                    />
                  </section>
                </Specimen>
                <Specimen
                  title="Native vs Select"
                  description="Consistent styling"
                >
                  <NativeSelect
                    className={styles.constrainedStyles}
                    defaultValue="us"
                  >
                    <NativeSelectOption value="us">
                      United States
                    </NativeSelectOption>
                    <NativeSelectOptGroup label="Europe">
                      <NativeSelectOption value="de">Germany</NativeSelectOption>
                      <NativeSelectOption value="fr">France</NativeSelectOption>
                    </NativeSelectOptGroup>
                  </NativeSelect>
                  <Select defaultValue="us">
                    <SelectTrigger className={styles.constrainedStyles}>
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>North America</SelectLabel>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Specimen>
                <Specimen title="Combobox" description="Open with results">
                  <Combobox items={FRAMEWORKS} defaultValue="Vite + React" defaultOpen>
                    <ComboboxInput
                      className={styles.constrainedStyles}
                      placeholder="Search framework…"
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No framework found.</ComboboxEmpty>
                      <ComboboxList>
                        {FRAMEWORKS.map((framework) => (
                          <ComboboxItem key={framework} value={framework}>
                            {framework}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </Specimen>
                <Specimen
                  title="Field"
                  description="Label + input + helper + error"
                >
                  <FieldGroup className={styles.constrainedMdStyles}>
                    <Field>
                      <FieldLabel htmlFor="field-email">Work email</FieldLabel>
                      <Input id="field-email" type="email" placeholder="you@novastudio.com" />
                      <FieldDescription>
                        We only use this for project updates.
                      </FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="field-seats">Seats</FieldLabel>
                      <Input id="field-seats" aria-invalid defaultValue="0" />
                      <FieldError errors={[{ message: "At least one seat is required." }]} />
                    </Field>
                  </FieldGroup>
                </Specimen>
              </section>
            </section>

            {/* ============ 5. FORM FIELDS — CHOICE ============ */}
            <section id="form-choice" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 5</small>
                <h2 className={styles.sectionTitleStyles}>Form fields — choice</h2>
                <p className={styles.sectionDescStyles}>
                  Checkbox, radio-group, switch and slider.
                </p>
              </header>
              <section className={styles.specimenGridStyles}>
                <Specimen title="Checkbox" description="States">
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Checkbox id="cb-1" />
                      <FieldLabel htmlFor="cb-1">Unchecked</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="cb-2" defaultChecked />
                      <FieldLabel htmlFor="cb-2">Checked</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="cb-3" indeterminate />
                      <FieldLabel htmlFor="cb-3">Indeterminate</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Checkbox id="cb-4" disabled />
                      <FieldLabel htmlFor="cb-4">Disabled</FieldLabel>
                    </Field>
                  </FieldGroup>
                </Specimen>
                <Specimen title="Radio group" description="Vertical">
                  <RadioGroup defaultValue="comfortable">
                    <Field orientation="horizontal">
                      <RadioGroupItem value="compact" id="rg-1" />
                      <FieldLabel htmlFor="rg-1">Compact</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="comfortable" id="rg-2" />
                      <FieldLabel htmlFor="rg-2">Comfortable</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <RadioGroupItem value="spacious" id="rg-3" />
                      <FieldLabel htmlFor="rg-3">Spacious</FieldLabel>
                    </Field>
                  </RadioGroup>
                </Specimen>
                <Specimen title="Switch" description="off · on · disabled">
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <Switch id="sw-1" />
                      <FieldLabel htmlFor="sw-1">Email alerts</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Switch id="sw-2" defaultChecked />
                      <FieldLabel htmlFor="sw-2">Auto-publish</FieldLabel>
                    </Field>
                    <Field orientation="horizontal">
                      <Switch id="sw-3" disabled />
                      <FieldLabel htmlFor="sw-3">Beta features</FieldLabel>
                    </Field>
                  </FieldGroup>
                </Specimen>
                <Specimen title="Slider" description="Single · range">
                  <section className={styles.progressColStyles}>
                    <Slider defaultValue={[60]} max={100} step={1} />
                    <Slider defaultValue={[25, 75]} max={100} step={1} />
                  </section>
                </Specimen>
              </section>
            </section>

            {/* ============ 6. DATE & CALENDAR ============ */}
            <section id="calendar" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 6</small>
                <h2 className={styles.sectionTitleStyles}>Date & calendar</h2>
                <p className={styles.sectionDescStyles}>
                  Inline calendar with single and range selection.
                </p>
              </header>
              <section className={styles.specimenGridTwoStyles}>
                <Specimen title="Single date">
                  <Calendar
                    mode="single"
                    selected={selectedDay}
                    onSelect={setSelectedDay}
                    defaultMonth={new Date(2026, 6, 1)}
                  />
                </Specimen>
                <Specimen title="Range" description="Two months">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={selectedRange}
                    onSelect={setSelectedRange}
                    defaultMonth={new Date(2026, 6, 1)}
                  />
                </Specimen>
              </section>
            </section>

            {/* ============ 7. FEEDBACK & STATUS ============ */}
            <section id="feedback" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 7</small>
                <h2 className={styles.sectionTitleStyles}>Feedback & status</h2>
                <p className={styles.sectionDescStyles}>
                  Alert, badge, progress, skeleton, spinner, empty and sonner
                  toasts.
                </p>
              </header>
              <section className={styles.specimenGridStyles}>
                <Specimen title="Alert" description="Base + destructive variants">
                  <section className={styles.alertColStyles}>
                    <Alert>
                      <InfoIcon />
                      <AlertTitle>Heads up — new theme available</AlertTitle>
                      <AlertDescription>
                        Aurora tokens are ready to preview.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <TriangleAlertIcon />
                      <AlertTitle>Publish failed</AlertTitle>
                      <AlertDescription>
                        The theme could not be saved. Try again.
                      </AlertDescription>
                    </Alert>
                  </section>
                </Specimen>
                <Specimen title="Badge" description="All variants, with/without icon">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Overdue</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="ghost">Ghost</Badge>
                  <Badge variant="link">Link</Badge>
                  <Badge variant="secondary">
                    <Icon icon={CircleCheckIcon} size="sm" />
                    Verified
                  </Badge>
                </Specimen>
                <Specimen title="Progress" description="0 · 45 · 100 · indeterminate">
                  <section className={styles.progressColStyles}>
                    <Progress value={0} />
                    <Progress value={45}>
                      <ProgressLabel>Rendering</ProgressLabel>
                      <ProgressValue />
                    </Progress>
                    <Progress value={100} />
                    <Progress value={null} />
                  </section>
                </Specimen>
                <Specimen title="Skeleton" description="Card placeholder">
                  <section className={styles.skeletonCardStyles}>
                    <section className={styles.skeletonRowStyles}>
                      <Skeleton className={styles.skeletonAvatarStyles} />
                      <section className={styles.skeletonLinesStyles}>
                        <Skeleton className={styles.skeletonTitleStyles} />
                        <Skeleton className={styles.skeletonLineShortStyles} />
                      </section>
                    </section>
                    <Skeleton className={styles.skeletonBlockStyles} />
                  </section>
                </Specimen>
                <Specimen title="Spinner" description="Sizes">
                  <Spinner className="size-4" />
                  <Spinner className="size-6" />
                  <Spinner className="size-8" />
                </Specimen>
                <Specimen title="Empty" description="Empty state">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Icon icon={InboxIcon} size="md" />
                      </EmptyMedia>
                      <EmptyTitle>No briefs yet</EmptyTitle>
                      <EmptyDescription>
                        Create your first design brief to get started.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button size="sm">
                        <Icon icon={PlusIcon} size="sm" />
                        New brief
                      </Button>
                    </EmptyContent>
                  </Empty>
                </Specimen>
                <Specimen title="Sonner" description="Themed toast previews">
                  <Button variant="outline" size="sm" onClick={toastPreview.showInfo}>
                    Info
                  </Button>
                  <Button variant="outline" size="sm" onClick={toastPreview.showSuccess}>
                    Success
                  </Button>
                  <Button variant="outline" size="sm" onClick={toastPreview.showWarning}>
                    Warning
                  </Button>
                  <Button variant="outline" size="sm" onClick={toastPreview.showError}>
                    Error
                  </Button>
                </Specimen>
              </section>
            </section>

            {/* ============ 8. OVERLAYS ============ */}
            <section id="overlays" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 8</small>
                <h2 className={styles.sectionTitleStyles}>Overlays</h2>
                <p className={styles.sectionDescStyles}>
                  Popover, tooltip and hover-card render open inline. Dialog,
                  alert-dialog, sheet and drawer are the real components — they
                  portal to the document body and trap focus, so they open on
                  click (rendering four modals open at once is not usable).
                </p>
              </header>
              <section className={styles.specimenGridStyles}>
                <Specimen title="Popover" description="Open with content">
                  <Popover defaultOpen modal={false}>
                    <PopoverTrigger
                      render={<Button variant="outline">Layout settings</Button>}
                    />
                    <PopoverContent>
                      <PopoverHeader>
                        <PopoverTitle>Dimensions</PopoverTitle>
                        <PopoverDescription>
                          Set the canvas size for exports.
                        </PopoverDescription>
                      </PopoverHeader>
                      <section className={styles.popoverBodyStyles}>
                        <Input placeholder="Width" defaultValue="1440" />
                        <Input placeholder="Height" defaultValue="1024" />
                      </section>
                    </PopoverContent>
                  </Popover>
                </Specimen>
                <Specimen title="Tooltip" description="Visible next to trigger">
                  <Tooltip defaultOpen>
                    <TooltipTrigger
                      render={
                        <Button variant="outline" size="icon-sm" aria-label="Info">
                          <Icon icon={InfoIcon} size="sm" />
                        </Button>
                      }
                    />
                    <TooltipContent>Tokens re-skin live</TooltipContent>
                  </Tooltip>
                </Specimen>
                <Specimen title="Hover card" description="Rich content">
                  <HoverCard defaultOpen>
                    <HoverCardTrigger render={<Button variant="link">@nova-studio</Button>} />
                    <HoverCardContent>
                      <strong>Nova Studio</strong>
                      <p className={styles.noteStyles}>
                        AI product design partner. 42 shipped design systems.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </Specimen>
                <Specimen title="Dialog" description="Opens on click">
                  <Dialog modal={false}>
                    <DialogTrigger render={<Button>Edit profile</Button>} />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                          Update your studio details and save.
                        </DialogDescription>
                      </DialogHeader>
                      <section className={styles.dialogFormStyles}>
                        <Label htmlFor="dlg-name">Display name</Label>
                        <Input id="dlg-name" defaultValue="Nova Studio" />
                      </section>
                      <DialogFooter showCloseButton>
                        <Button>Save changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Specimen>
                <Specimen title="Alert dialog" description="Destructive confirm">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={<Button variant="destructive">Delete workspace</Button>}
                    />
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes all projects. This cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Specimen>
                <Specimen title="Sheet" description="Side panel">
                  <Sheet modal={false}>
                    <SheetTrigger render={<Button variant="outline">Open panel</Button>} />
                    <SheetContent side="right">
                      <SheetHeader>
                        <SheetTitle>Project settings</SheetTitle>
                        <SheetDescription>
                          Manage visibility and collaborators.
                        </SheetDescription>
                      </SheetHeader>
                      <SheetFooter>
                        <Button>Save</Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </Specimen>
                <Specimen title="Drawer" description="Bottom overlay">
                  <Drawer modal={false}>
                    <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Filters</DrawerTitle>
                        <DrawerDescription>
                          Refine the project list.
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter>
                        <Button>Apply filters</Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </Specimen>
              </section>
            </section>

            {/* ============ 9. MENUS & COMMAND ============ */}
            <section id="menus" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 9</small>
                <h2 className={styles.sectionTitleStyles}>Menus & command</h2>
                <p className={styles.sectionDescStyles}>
                  Dropdown-menu, context-menu, menubar and the command palette.
                </p>
              </header>
              <section className={styles.specimenGridStyles}>
                <Specimen title="Dropdown menu" description="Open with submenu">
                  <DropdownMenu defaultOpen modal={false}>
                    <DropdownMenuTrigger
                      render={<Button variant="outline">Account</Button>}
                    />
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>My account</DropdownMenuLabel>
                        <DropdownMenuItem>
                          Profile
                          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Team</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem>Invite members</DropdownMenuItem>
                          <DropdownMenuItem>Permissions</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Specimen>
                <Specimen title="Context menu" description="Right-click the area">
                  <ContextMenu>
                    <ContextMenuTrigger className={styles.contextTargetStyles}>
                      Right-click here
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuGroup>
                        <ContextMenuLabel>Canvas</ContextMenuLabel>
                        <ContextMenuItem>
                          Duplicate
                          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem>Rename</ContextMenuItem>
                      </ContextMenuGroup>
                      <ContextMenuSeparator />
                      <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </Specimen>
                <Specimen title="Menubar" description="One menu open">
                  <Menubar>
                    <MenubarMenu defaultOpen>
                      <MenubarTrigger>File</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>
                          New file
                          <MenubarShortcut>⌘N</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>Open…</MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem>Export</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>Edit</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>Undo</MenubarItem>
                        <MenubarItem>Redo</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                      <MenubarTrigger>View</MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem>Zoom in</MenubarItem>
                        <MenubarItem>Zoom out</MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </Specimen>
                <Specimen title="Command" description="⌘K palette, inline">
                  <Command className={styles.commandWrapStyles}>
                    <CommandInput placeholder="Type a command or search…" />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        <CommandItem>
                          <Icon icon={LayoutDashboardIcon} size="sm" />
                          Dashboard
                          <CommandShortcut>⌘D</CommandShortcut>
                        </CommandItem>
                        <CommandItem>
                          <Icon icon={FolderIcon} size="sm" />
                          Projects
                        </CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup heading="Settings">
                        <CommandItem>
                          <Icon icon={SettingsIcon} size="sm" />
                          Preferences
                          <CommandShortcut>⌘,</CommandShortcut>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </Specimen>
              </section>
            </section>

            {/* ============ 10. NAVIGATION ============ */}
            <section id="navigation" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 10</small>
                <h2 className={styles.sectionTitleStyles}>Navigation</h2>
                <p className={styles.sectionDescStyles}>
                  Navigation-menu, tabs, breadcrumb, pagination, sidebar and
                  direction (LTR/RTL).
                </p>
              </header>
              <section className={styles.colStyles}>
                <Specimen title="Navigation menu" description="Submenu open">
                  <NavigationMenu defaultValue="products">
                    <NavigationMenuList>
                      <NavigationMenuItem value="products">
                        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className={styles.navMenuPanelStyles}>
                            <li>
                              <NavigationMenuLink
                                href="#navigation"
                                className={styles.navMenuLinkStyles}
                              >
                                <strong className={styles.navMenuLinkTitleStyles}>
                                  Design system
                                </strong>
                                <small className={styles.navMenuLinkDescStyles}>
                                  Tokens, components, docs
                                </small>
                              </NavigationMenuLink>
                            </li>
                            <li>
                              <NavigationMenuLink
                                href="#navigation"
                                className={styles.navMenuLinkStyles}
                              >
                                <strong className={styles.navMenuLinkTitleStyles}>
                                  Aurora AI
                                </strong>
                                <small className={styles.navMenuLinkDescStyles}>
                                  Generative design assistant
                                </small>
                              </NavigationMenuLink>
                            </li>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                      <NavigationMenuItem value="pricing">
                        <NavigationMenuLink href="#navigation">
                          Pricing
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </Specimen>

                <section className={styles.specimenGridStyles}>
                  <Specimen title="Tabs" description="Default variant">
                    <Tabs defaultValue="overview">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className={styles.tabPanelStyles}>
                        42 active projects across 8 clients.
                      </TabsContent>
                      <TabsContent value="activity" className={styles.tabPanelStyles}>
                        14 updates this week.
                      </TabsContent>
                      <TabsContent value="settings" className={styles.tabPanelStyles}>
                        Manage workspace preferences.
                      </TabsContent>
                    </Tabs>
                  </Specimen>
                  <Specimen title="Tabs" description="Line variant">
                    <Tabs defaultValue="specs">
                      <TabsList variant="line">
                        <TabsTrigger value="specs">Specs</TabsTrigger>
                        <TabsTrigger value="assets">Assets</TabsTrigger>
                      </TabsList>
                      <TabsContent value="specs" className={styles.tabPanelStyles}>
                        Redlines and tokens.
                      </TabsContent>
                      <TabsContent value="assets" className={styles.tabPanelStyles}>
                        Exports and source files.
                      </TabsContent>
                    </Tabs>
                  </Specimen>
                  <Specimen title="Breadcrumb" description="With separators">
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#navigation">
                            <Icon icon={HomeIcon} size="sm" />
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink href="#navigation">Projects</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbEllipsis />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Aurora dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </Specimen>
                  <Specimen title="Pagination" description="Prev/next + ellipsis">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#navigation" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#navigation">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#navigation" isActive>
                            2
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#navigation">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#navigation" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </Specimen>
                </section>

                <Specimen title="Direction" description="LTR and RTL">
                  <section className={styles.directionPairStyles}>
                    <DirectionProvider direction="ltr">
                      <section className={styles.directionBlockStyles}>
                        <Avatar size="sm">
                          <AvatarFallback>NS</AvatarFallback>
                        </Avatar>
                        <section className={styles.directionLabelStyles}>
                          <strong>Left to right</strong>
                          <small className={styles.noteStyles}>Default reading order</small>
                        </section>
                        <Icon icon={ArrowRightIcon} size="sm" />
                      </section>
                    </DirectionProvider>
                    <DirectionProvider direction="rtl">
                      <section className={styles.directionBlockStyles} dir="rtl">
                        <Avatar size="sm">
                          <AvatarFallback>عن</AvatarFallback>
                        </Avatar>
                        <section className={styles.directionLabelStyles}>
                          <strong>من اليمين لليسار</strong>
                          <small className={styles.noteStyles}>Right to left</small>
                        </section>
                        <Icon icon={ArrowRightIcon} size="sm" />
                      </section>
                    </DirectionProvider>
                  </section>
                </Specimen>

                <Specimen
                  title="Sidebar"
                  description="Inline preview (the icon/offcanvas collapse modes use viewport-fixed positioning; the SidebarTrigger toggles state)"
                >
                  <section className={styles.sidebarFrameStyles}>
                    <SidebarProvider defaultOpen>
                      <Sidebar collapsible="none">
                        <SidebarHeader>
                          <strong>Nova Studio</strong>
                        </SidebarHeader>
                        <SidebarContent>
                          <SidebarGroup>
                            <SidebarGroupLabel>Platform</SidebarGroupLabel>
                            <SidebarGroupContent>
                              <SidebarMenu>
                                <SidebarMenuItem>
                                  <SidebarMenuButton isActive tooltip="Dashboard">
                                    <Icon icon={LayoutDashboardIcon} size="sm" />
                                    Dashboard
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                  <SidebarMenuButton tooltip="Projects">
                                    <Icon icon={FolderIcon} size="sm" />
                                    Projects
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                  <SidebarMenuButton tooltip="Team">
                                    <Icon icon={UsersIcon} size="sm" />
                                    Team
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                  <SidebarMenuButton tooltip="Notifications">
                                    <Icon icon={BellIcon} size="sm" />
                                    Notifications
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </SidebarMenu>
                            </SidebarGroupContent>
                          </SidebarGroup>
                        </SidebarContent>
                        <SidebarFooter>
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton tooltip="Settings">
                                <Icon icon={SettingsIcon} size="sm" />
                                Settings
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </SidebarFooter>
                      </Sidebar>
                      <SidebarInset>
                        <SidebarTrigger />
                      </SidebarInset>
                    </SidebarProvider>
                  </section>
                </Specimen>
              </section>
            </section>

            {/* ============ 11. DATA DISPLAY ============ */}
            <section id="data-display" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 11</small>
                <h2 className={styles.sectionTitleStyles}>Data display</h2>
                <p className={styles.sectionDescStyles}>
                  Table, card, avatar, separator, aspect-ratio, scroll-area,
                  accordion, collapsible, resizable, item and charts.
                </p>
              </header>

              <section className={styles.statGridStyles}>
                <Card>
                  <CardHeader>
                    <CardDescription>Monthly recurring revenue</CardDescription>
                    <CardTitle className={styles.statValueStyles}>$46,450</CardTitle>
                    <CardAction>
                      <Button variant="ghost" size="icon-sm" aria-label="More">
                        <Icon icon={MoreHorizontalIcon} size="sm" />
                      </Button>
                    </CardAction>
                  </CardHeader>
                  <CardFooter>
                    <small className={styles.statTrendStyles}>+12.4% vs last month</small>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Aurora dashboard</CardTitle>
                    <CardDescription>Design preview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AspectRatio ratio={16 / 9}>
                      <figure className={styles.mediaFigureStyles}>
                        <Icon icon={ImageIcon} size="lg" />
                      </figure>
                    </AspectRatio>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Invite your team</CardTitle>
                    <CardDescription>
                      Collaborators can view and comment on projects.
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button size="sm">
                      <Icon icon={PlusIcon} size="sm" />
                      Add members
                    </Button>
                  </CardFooter>
                </Card>
              </section>

              <Specimen title="Table" description="Status + actions column" bodyClassName={styles.colStyles}>
                <Table>
                  <TableCaption>Recent invoices — Q3 2026</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className={styles.cellNumericStyles}>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INVOICES.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.client}</TableCell>
                        <TableCell>{invoice.service}</TableCell>
                        <TableCell>
                          <Badge variant={badgeStatusVariant(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className={styles.cellNumericStyles}>
                          {invoice.amount}
                        </TableCell>
                        <TableCell>
                          <section className={styles.tableActionsStyles}>
                            <Button variant="ghost" size="icon-sm" aria-label="Download">
                              <Icon icon={DownloadIcon} size="sm" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="Delete">
                              <Icon icon={TrashIcon} size="sm" />
                            </Button>
                          </section>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Specimen>

              <section className={styles.specimenGridStyles}>
                <Specimen title="Avatar" description="Sizes · group · badge">
                  <section className={styles.avatarRowStyles}>
                    <Avatar size="sm">
                      <AvatarFallback>PM</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Avatar size="lg">
                      <AvatarFallback>NS</AvatarFallback>
                      <AvatarBadge />
                    </Avatar>
                    <AvatarGroup>
                      <Avatar>
                        <AvatarFallback>AL</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback>MK</AvatarFallback>
                      </Avatar>
                      <Avatar>
                        <AvatarFallback>RC</AvatarFallback>
                      </Avatar>
                      <AvatarGroupCount>+4</AvatarGroupCount>
                    </AvatarGroup>
                  </section>
                </Specimen>
                <Specimen title="Separator" description="Horizontal + vertical">
                  <section className={styles.colStyles}>
                    <Separator />
                    <section className={styles.separatorRowStyles}>
                      <small>Docs</small>
                      <Separator orientation="vertical" />
                      <small>API</small>
                      <Separator orientation="vertical" />
                      <small>Support</small>
                    </section>
                  </section>
                </Specimen>
                <Specimen title="Aspect ratio" description="16:9 and 1:1">
                  <section className={styles.aspectGridStyles}>
                    <AspectRatio ratio={16 / 9}>
                      <figure className={styles.aspectFigureStyles}>16 : 9</figure>
                    </AspectRatio>
                    <AspectRatio ratio={1}>
                      <figure className={styles.aspectFigureStyles}>1 : 1</figure>
                    </AspectRatio>
                  </section>
                </Specimen>
                <Specimen title="Scroll area" description="Fixed height list">
                  <ScrollArea className={styles.scrollAreaStyles}>
                    <ul className={styles.scrollAreaListStyles}>
                      {Array.from({ length: 12 }, (_, index) => (
                        <li
                          key={index}
                          className={styles.scrollAreaItemStyles}
                        >
                          Release note v2.{index + 1}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </Specimen>
                <Specimen title="Accordion" description="One open">
                  <Accordion defaultValue={["a"]} className={styles.constrainedMdStyles}>
                    <AccordionItem value="a">
                      <AccordionTrigger>What's included?</AccordionTrigger>
                      <AccordionContent>
                        Tokens, 60 components, and a themed preview.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="b">
                      <AccordionTrigger>Can I reskin it?</AccordionTrigger>
                      <AccordionContent>
                        Yes — edit theme.css and everything updates.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="c">
                      <AccordionTrigger>Dark mode?</AccordionTrigger>
                      <AccordionContent>
                        Both light and dark ship out of the box.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Specimen>
                <Specimen title="Collapsible" description="Open state">
                  <Collapsible defaultOpen className={styles.constrainedMdStyles}>
                    <CollapsibleTrigger
                      render={<Button variant="ghost">Advanced settings</Button>}
                    />
                    <CollapsibleContent>
                      <p className={styles.noteStyles}>
                        Export scale, color profile and metadata options.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </Specimen>
              </section>

              <Specimen title="Resizable" description="Two-panel layout" bodyClassName={styles.colStyles}>
                <ResizablePanelGroup
                  orientation="horizontal"
                  className={styles.resizableGroupStyles}
                >
                  <ResizablePanel defaultSize={40}>
                    <section className={styles.resizablePanelStyles}>Layers</section>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={60}>
                    <section className={styles.resizablePanelStyles}>Canvas</section>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </Specimen>

              <Specimen title="Item" description="Generic list rows" bodyClassName={styles.colStyles}>
                <ItemGroup className={styles.itemListStyles}>
                  <Item variant="outline">
                    <ItemMedia variant="icon">
                      <Icon icon={FileTextIcon} size="sm" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Brand guidelines.pdf</ItemTitle>
                      <ItemDescription>Updated 2 days ago · 4.2 MB</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="icon-sm" aria-label="Download">
                        <Icon icon={DownloadIcon} size="sm" />
                      </Button>
                    </ItemActions>
                  </Item>
                  <Item variant="outline">
                    <ItemMedia variant="icon">
                      <Icon icon={CreditCardIcon} size="sm" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Billing</ItemTitle>
                      <ItemDescription>Visa ending 4242</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </Specimen>

              <section className={styles.chartGridStyles}>
                <Specimen title="Bar chart" description="Acquisition by month" bodyClassName={styles.colStyles}>
                  <ChartContainer config={BAR_CONFIG} className={styles.chartBodyStyles}>
                    <BarChart data={TRAFFIC}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="organic" fill="var(--color-organic)" radius={4} />
                      <Bar dataKey="referral" fill="var(--color-referral)" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </Specimen>
                <Specimen title="Area chart" description="Weekly sessions" bodyClassName={styles.colStyles}>
                  <ChartContainer config={AREA_CONFIG} className={styles.chartBodyStyles}>
                    <AreaChart data={ENGAGEMENT}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="week" tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        dataKey="sessions"
                        type="monotone"
                        stroke="var(--color-sessions)"
                        fill="var(--color-sessions)"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </Specimen>
                <Specimen title="Donut chart" description="Traffic by channel" bodyClassName={styles.colStyles}>
                  <ChartContainer config={PIE_CONFIG} className={styles.chartBodyStyles}>
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="channel" />} />
                      <Pie
                        data={CHANNELS}
                        dataKey="value"
                        nameKey="channel"
                        innerRadius={50}
                        outerRadius={80}
                      >
                        {CHANNELS.map((slice) => (
                          <Cell key={slice.channel} fill={slice.fill} />
                        ))}
                      </Pie>
                      <ChartLegend content={<ChartLegendContent nameKey="channel" />} />
                    </PieChart>
                  </ChartContainer>
                </Specimen>
              </section>
            </section>

            {/* ============ 12. MEDIA & FILES ============ */}
            <section id="media" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 12</small>
                <h2 className={styles.sectionTitleStyles}>Media & files</h2>
                <p className={styles.sectionDescStyles}>
                  Attachment tiles and the carousel.
                </p>
              </header>
              <section className={styles.specimenGridTwoStyles}>
                <Specimen title="Attachment" description="Document + image tiles" bodyClassName={styles.colStyles}>
                  <AttachmentGroup className={styles.attachmentRowStyles}>
                    <Attachment>
                      <AttachmentMedia variant="icon">
                        <Icon icon={FileTextIcon} size="sm" />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>research-brief.pdf</AttachmentTitle>
                        <AttachmentDescription>2.4 MB</AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions>
                        <AttachmentAction aria-label="Remove research-brief.pdf">
                          <Icon icon={TrashIcon} size="sm" />
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                    <Attachment>
                      <AttachmentMedia variant="image">
                        <Icon icon={ImageIcon} size="sm" />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>hero-mockup.png</AttachmentTitle>
                        <AttachmentDescription>1.1 MB</AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions>
                        <AttachmentAction aria-label="Remove hero-mockup.png">
                          <Icon icon={TrashIcon} size="sm" />
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                  </AttachmentGroup>
                </Specimen>
                <Specimen title="Carousel" description="Prev/next controls" bodyClassName={styles.colStyles}>
                  <Carousel opts={{ align: "start" }} className={styles.carouselWrapStyles}>
                    <CarouselContent>
                      {["Discover", "Define", "Design", "Deliver"].map((phase) => (
                        <CarouselItem key={phase}>
                          <figure className={styles.carouselItemInnerStyles}>
                            <strong className={styles.carouselItemLabelStyles}>
                              {phase}
                            </strong>
                          </figure>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </Specimen>
              </section>
            </section>

            {/* ============ 13. MESSAGING ============ */}
            <section id="messaging" className={styles.sectionStyles}>
              <header className={styles.sectionHeaderStyles}>
                <small className={styles.sectionKickerStyles}>Section 13</small>
                <h2 className={styles.sectionTitleStyles}>Messaging</h2>
                <p className={styles.sectionDescStyles}>
                  Bubble, message and the message-scroller conversation view.
                </p>
              </header>
              <section className={styles.specimenGridTwoStyles}>
                <Specimen title="Bubble" description="Sent + received" bodyClassName={styles.colStyles}>
                  <BubbleGroup className={styles.chatWrapStyles}>
                    <Bubble variant="muted" align="start">
                      <BubbleContent>Morning! Did the tokens land?</BubbleContent>
                    </Bubble>
                    <Bubble align="end">
                      <BubbleContent>Yes — reskinned instantly ✨</BubbleContent>
                    </Bubble>
                    <time className={styles.timeStyles}>9:41 AM</time>
                  </BubbleGroup>
                </Specimen>
                <Specimen title="Message" description="Avatar + bubble + meta" bodyClassName={styles.colStyles}>
                  <MessageGroup className={styles.chatWrapStyles}>
                    <Message align="start">
                      <MessageAvatar>
                        <Avatar size="sm">
                          <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                      <MessageContent>
                        <MessageHeader>Aurora Assistant</MessageHeader>
                        <Bubble variant="muted" align="start">
                          <BubbleContent>
                            I generated three theme variants for review.
                          </BubbleContent>
                        </Bubble>
                        <MessageFooter>9:38 AM</MessageFooter>
                      </MessageContent>
                    </Message>
                    <Message align="end">
                      <MessageContent>
                        <Bubble align="end">
                          <BubbleContent>Ship the warm one.</BubbleContent>
                        </Bubble>
                        <MessageFooter>9:39 AM</MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageGroup>
                </Specimen>
                <Specimen title="Message scroller" description="Scrollable conversation" bodyClassName={styles.colStyles}>
                  <MessageScrollerProvider>
                    <MessageScroller className={styles.scrollerStyles}>
                      <MessageScrollerViewport>
                        <MessageScrollerContent className={styles.scrollerBodyStyles}>
                          {CONVERSATION.map((message, index) => (
                            <MessageScrollerItem
                              key={message.id}
                              scrollAnchor={index === CONVERSATION.length - 1}
                            >
                              <Message align={message.align}>
                                {message.align === "start" ? (
                                  <MessageAvatar>
                                    <Avatar size="sm">
                                      <AvatarFallback>P</AvatarFallback>
                                    </Avatar>
                                  </MessageAvatar>
                                ) : null}
                                <MessageContent>
                                  <MessageHeader>{message.author}</MessageHeader>
                                  <Bubble
                                    align={message.align}
                                    variant={message.align === "end" ? "default" : "muted"}
                                  >
                                    <BubbleContent>{message.text}</BubbleContent>
                                  </Bubble>
                                  <MessageFooter>{message.time}</MessageFooter>
                                </MessageContent>
                              </Message>
                            </MessageScrollerItem>
                          ))}
                        </MessageScrollerContent>
                      </MessageScrollerViewport>
                      <MessageScrollerButton direction="end" />
                    </MessageScroller>
                  </MessageScrollerProvider>
                </Specimen>
              </section>
            </section>
          </article>
        </section>
      </main>
    </TooltipProvider>
  );
}
