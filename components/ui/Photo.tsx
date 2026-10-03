import Image from "next/image";
import { IMAGES, isImageKey } from "@/lib/images";
import { cn } from "@/lib/cn";

/**
 * A photo from the registry, filling its (relatively positioned) parent.
 * Missing keys fall back to a quiet mist block so layouts never collapse.
 */
export function Photo({
  name,
  sizes,
  priority = false,
  className,
  alt,
}: {
  name: string | undefined;
  /** Rendered width hint for responsive loading, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Overrides the registry alt; pass "" for purely decorative use. */
  alt?: string;
}) {
  if (!isImageKey(name)) return <div aria-hidden className={cn("absolute inset-0 bg-mist", className)} />;
  const img = IMAGES[name];
  return (
    <Image
      src={img.src}
      alt={alt ?? img.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      className={cn("object-cover", className)}
    />
  );
}
