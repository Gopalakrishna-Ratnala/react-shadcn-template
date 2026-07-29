export const themeToggleStyles = {
  button: "relative",
  // No size-4 here deliberately: Button's own base CSS already auto-sizes any
  // child SVG that has no explicit size-* class
  // ([&_svg:not([class*='size-'])]:size-4 in button.tsx) - adding our own
  // would be redundant. data-icon="inline-start"/"inline-end" isn't used here
  // either: that attribute exists to coordinate padding with adjacent text
  // (has-data-[icon=inline-end]:pr-2 in button.tsx), and this is a pure
  // icon-only button (size="icon", no text) with two icons cross-fading in
  // the same spot - there's no text to coordinate spacing with.
  icon: "scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90",
  iconDark:
    "absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0",
};
