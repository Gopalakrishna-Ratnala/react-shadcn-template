import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// jsdom lacks matchMedia (needed by next-themes) and the observer APIs used by
// Base UI / embla / recharts. Provide minimal no-op implementations for tests.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class MockObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.ResizeObserver ??= MockObserver as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??=
  MockObserver as unknown as typeof IntersectionObserver;

// jsdom doesn't implement scrollIntoView, needed by cmdk's Command component.
Element.prototype.scrollIntoView ??= vi.fn();

// jsdom doesn't implement getAnimations, needed by Base UI's ScrollArea viewport.
Element.prototype.getAnimations ??= vi.fn(() => []);
