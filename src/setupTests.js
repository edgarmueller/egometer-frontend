import "@testing-library/jest-dom/vitest";

// jsdom lacks ResizeObserver, which MUI X charts observe their size with
globalThis.ResizeObserver ??= class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
