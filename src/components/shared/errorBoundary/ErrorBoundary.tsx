import { Component } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import { errorBoundaryStyles } from "./ErrorBoundary.styles";

import type { ErrorBoundaryProps, ErrorBoundaryState } from "./types";

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { hasError: true, message };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" className={errorBoundaryStyles.fallback}>
            <p>{this.state.message}</p>
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
