import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

import {
  specimenBodyStyles,
  specimenContainerStyles,
  specimenDescriptionStyles,
  specimenHeaderStyles,
  specimenTitleStyles,
} from "./Specimen.styles";

import type { SpecimenProps } from "./types";

export const Specimen = ({
  title,
  description,
  children,
  bodyClassName,
  className,
}: SpecimenProps): ReactElement => {
  return (
    <article className={cn(specimenContainerStyles, className)}>
      <header className={specimenHeaderStyles}>
        <h3 className={specimenTitleStyles}>{title}</h3>
        {description ? (
          <p className={specimenDescriptionStyles}>{description}</p>
        ) : null}
      </header>
      <section className={cn(specimenBodyStyles, bodyClassName)}>
        {children}
      </section>
    </article>
  );
};
