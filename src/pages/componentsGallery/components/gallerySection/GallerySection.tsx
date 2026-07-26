import { gallerySectionStyles } from "./GallerySection.styles";
import type { GallerySectionProps } from "./types";

export function GallerySection({
  id,
  title,
  description,
  children,
}: GallerySectionProps) {
  return (
    <section
      id={id}
      className={gallerySectionStyles.section}
      aria-labelledby={`${id}-heading`}
    >
      <div className={gallerySectionStyles.heading}>
        <h2 id={`${id}-heading`} className={gallerySectionStyles.title}>
          {title}
        </h2>
        {description ? (
          <p className={gallerySectionStyles.description}>{description}</p>
        ) : null}
      </div>
      <div className={gallerySectionStyles.content}>{children}</div>
    </section>
  );
}
