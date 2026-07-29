import type { ReactElement } from "react";

import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { routeErrorFallbackStyles as styles } from "./RouteErrorFallback.styles";

import type { RouteErrorFallbackProps } from "./types";

const getErrorMessage = (error: unknown): string => {
  if (isRouteErrorResponse(error)) {
    return error.data?.message ?? error.statusText ?? "Something went wrong";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};

export const RouteErrorFallback = ({
  title = "This page failed to load",
}: RouteErrorFallbackProps): ReactElement => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <section className={styles.wrapper}>
      <Alert variant="destructive">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{getErrorMessage(error)}</AlertDescription>
      </Alert>
      <Button onClick={() => navigate(0)}>Try again</Button>
    </section>
  );
};
