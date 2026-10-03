import { cn } from "@/lib/cn";
import { Photo } from "@/components/ui/Photo";
import { Parallax } from "./Parallax";
import { Reveal } from "./Reveal";

/**
 * A framed photo that opens on scroll-in and drifts inside its frame as the
 * page moves. The image is oversized vertically so the drift never shows an edge.
 */
export function ParallaxPhoto({
  name,
  sizes,
  speed = 40,
  priority = false,
  alt,
  delay = 0,
  className,
}: {
  name: string;
  sizes: string;
  speed?: number;
  priority?: boolean;
  alt?: string;
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal variant="image" delay={delay} className={cn("relative overflow-hidden rounded-media", className)}>
      <Parallax speed={speed} className="absolute inset-x-0 -top-[12%] -bottom-[12%]">
        <Photo name={name} sizes={sizes} priority={priority} alt={alt} />
      </Parallax>
    </Reveal>
  );
}
