export const componentsGalleryPageStyles = {
  page: "flex min-h-screen bg-background text-foreground",
  nav: "sticky top-0 hidden h-screen w-56 shrink-0 overflow-y-auto border-r border-border px-4 py-8 lg:block",
  navTitle:
    "mb-4 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
  navList: "flex flex-col gap-1",
  navLink:
    "rounded-[var(--radius)] px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
  main: "mx-auto w-full max-w-4xl flex-1 px-6 py-10 sm:px-10",
  header: "mb-8 flex flex-col gap-2",
  title: "text-3xl font-bold text-foreground",
  subtitle: "text-sm text-muted-foreground",
  swatchGrid: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4",
  row: "flex flex-wrap items-center gap-3",
  typographySample: "flex flex-col gap-1",
  typographyHero:
    "text-[length:var(--text-4xl)] leading-[var(--leading-4xl)] font-bold",
  typographyHeading:
    "text-[length:var(--text-2xl)] leading-[var(--leading-2xl)] font-semibold",
  typographyBody:
    "text-[length:var(--text-base)] leading-[var(--leading-base)]",
  typographyHelper:
    "text-[length:var(--text-sm)] leading-[var(--leading-sm)] text-muted-foreground",
  formGrid: "grid max-w-sm grid-cols-1 gap-4",
  formField: "flex flex-col gap-2",
};
