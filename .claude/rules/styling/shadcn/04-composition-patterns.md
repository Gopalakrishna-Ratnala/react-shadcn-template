---
description: shadcn/ui composition patterns — Group nesting, overlay accessibility, Card/Avatar/Tabs composition, icons, loading states. Confirmed against the official shadcn-ui/ui skill (github.com/shadcn-ui/ui/tree/main/skills/shadcn). Active when using shadcn/ui as the UI library.
paths: ["src/**/*.tsx"]
---

# shadcn/ui Composition Patterns

These rules exist to prevent the most common shadcn/ui mistakes — using a component
without its required sub-structure, or building custom markup where a vendored
primitive already exists. Every rule here was confirmed against the official
shadcn-ui/ui skill, not guessed.

## Use Components, Not Custom Markup

Check whether a vendored primitive already exists before writing custom markup:

| Instead of a custom... | Use |
| --- | --- |
| Styled callout `<div>` | `Alert` |
| Custom "no data" markup | `Empty` (`EmptyHeader` / `EmptyMedia` / `EmptyTitle` / `EmptyDescription` / `EmptyContent`) |
| `<hr>` or a `border-t` div | `Separator` |
| Custom `animate-pulse` div | `Skeleton` |
| Styled `<span>` for a status pill | `Badge` |
| Manual toast/notification div | `toast()` from `sonner` |

## Group Nesting — Items Always Live Inside Their Group

- `SelectItem` → always inside a `SelectGroup`
- `DropdownMenuItem` → always inside a `DropdownMenuGroup`
- `CommandItem` → always inside a `CommandGroup`

## Overlays

- `Dialog`, `Sheet`, and `Drawer` always need a `Title` component
  (`DialogTitle`, `SheetTitle`, `DrawerTitle`) for accessibility — even if it's
  visually hidden. Never omit it; use `className="sr-only"` if it shouldn't be
  visible.
- Never set a manual `z-index` on `Dialog`, `Sheet`, `Popover`, `DropdownMenu`, or
  any other overlay component — they manage their own stacking internally.

```tsx
// WRONG — no title, fails accessibility
<Dialog>
  <DialogContent>
    <p>Are you sure?</p>
  </DialogContent>
</Dialog>

// CORRECT — title present, hidden visually if the design doesn't show one
<Dialog>
  <DialogContent>
    <DialogTitle className="sr-only">Confirm action</DialogTitle>
    <p>Are you sure?</p>
  </DialogContent>
</Dialog>
```

## Card — Use the Full Composition

Always compose `Card` with its actual sub-components — never dump everything
directly into `CardContent`:

```tsx
// WRONG — everything crammed into CardContent
<Card>
  <CardContent>
    <h3>Title</h3>
    <p>Description</p>
    <p>Body content</p>
  </CardContent>
</Card>

// CORRECT
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Body content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

## Avatar

`Avatar` always needs an `AvatarFallback`, for when the image fails to load:

```tsx
<Avatar>
  <AvatarImage src={user.avatarUrl} alt={user.name} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

## Tabs

`TabsTrigger` must always be inside a `TabsList` — never rendered directly
inside `Tabs`.

## Button Loading State

`Button` has no `isPending`/`isLoading` prop. Compose the loading state instead,
using `Spinner` + `data-icon` + `disabled`:

```tsx
// WRONG — Button has no such prop
<Button isLoading={isPending}>Submit</Button>

// CORRECT
<Button disabled={isPending}>
  {isPending && <Spinner data-icon="inline-start" />}
  Submit
</Button>
```

## Icons

- Icons rendered inside a `Button` alongside text MUST have `data-icon="inline-start"`
  or `data-icon="inline-end"` — this is what drives the component's own padding
  adjustment next to the icon (`has-data-[icon=inline-end]:pr-2` etc. in `button.tsx`).
- Never add manual sizing classes (`size-4`, `w-4 h-4`) to an icon inside a
  vendored component — the component's own CSS already auto-sizes any child SVG
  that has no explicit `size-*` class (e.g. `button.tsx`'s
  `[&_svg:not([class*='size-'])]:size-4`). Adding your own is redundant and can
  silently disable that auto-sizing if it ever changes upstream.
- `data-icon` only applies when there's adjacent text to coordinate spacing
  with. A pure icon-only button (`size="icon"`, no text content — e.g. this
  project's `ThemeToggle`) has nothing to coordinate spacing against, so
  `data-icon` isn't applicable there; don't force it in just to satisfy the
  letter of this rule where the underlying reason for it doesn't apply.

```tsx
// WRONG — manual sizing, no data-icon
<Button>
  <SearchIcon className="size-4 mr-2" />
  Search
</Button>

// CORRECT
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>
```

## Whole-Card Click Targets

`Card` is a plain `<div>`-backed component with no Base UI `render` prop to turn
it into a real `<button>`, and putting an `onClick` directly on a `Card` (or any
div/span) is exactly what `check-no-div-span.sh`/`core/08-accessibility.md`
forbid — a bare clickable container has no keyboard/screen-reader affordance.

Use the **stretched-link/stretched-overlay pattern** instead: a real `Button`
(or `Link`) as the last child of the `Card`, visually invisible but covering the
whole card via absolute positioning, carrying a real `aria-label` describing the
destination/action:

```tsx
<Card className="relative">
  <CardHeader>
    <CardTitle>{member.name}</CardTitle>
    <CardDescription>{member.role}</CardDescription>
  </CardHeader>
  <Button
    variant="link"
    className="absolute inset-0 h-full w-full"
    aria-label={`View ${member.name}'s profile`}
    onClick={() => openMemberDetail(member.id)}
  />
</Card>
```

This keeps the card itself as plain content (no click handler on a div), gives
keyboard users a real, focusable, labeled control, and still makes the entire
visual card clickable — the standard accessible technique for this exact case,
not something to reinvent per feature.
