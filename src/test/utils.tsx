/**
 * Custom test render utilities for Symptom Scribe.
 *
 * Re-exports everything from @testing-library/react and provides a custom
 * `render` wrapper that wraps components with the application's required
 * providers (QueryClient, MemoryRouter, ThemeProvider).
 *
 * ## Usage
 *
 * Import `render` and `screen` from this file instead of
 * `@testing-library/react` directly:
 *
 * ```tsx
 * import { render, screen } from "@/test/utils";
 *
 * it("renders the heading", () => {
 *   render(<MyComponent />);
 *   expect(screen.getByRole("heading")).toBeInTheDocument();
 * });
 * ```
 *
 * ## Adding providers
 *
 * If a new global provider is added to the app (e.g. a feature-flag context),
 * add it to the `AllProviders` component below so every test automatically
 * benefits without per-file boilerplate.
 */
import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Creates a fresh QueryClient for each test to avoid cross-test cache pollution.
 * Retries and network error logging are disabled to keep test output clean.
 */
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

interface AllProvidersProps {
  children: React.ReactNode;
  /** Override the initial route for router-dependent tests */
  initialEntries?: string[];
}

/**
 * Wraps children with every provider the application requires.
 * Extend this component whenever a new top-level provider is introduced.
 */
function AllProviders({
  children,
  initialEntries = ["/"],
}: AllProvidersProps) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

/**
 * Custom render function. Accepts the same options as RTL's `render` plus an
 * optional `initialEntries` array to control the router's starting location.
 */
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { initialEntries?: string[] }
) {
  const { initialEntries, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders initialEntries={initialEntries}>{children}</AllProviders>
    ),
    ...renderOptions,
  });
}

// Re-export everything from RTL so tests only need one import.
export * from "@testing-library/react";
// Override the default `render` with our custom one.
export { customRender as render };
