import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pages } from "@/data/pages";

export default function NotFound() {
  const { notFound } = pages;
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center gap-6 py-(--section-y)">
      <span aria-hidden className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-pink" />
        <span className="h-0.5 w-10 bg-line" />
        <span className="size-3 rounded-full border-2 border-dashed border-muted" />
      </span>
      <h1 className="max-w-[18ch] text-h1">{notFound.title}</h1>
      <p className="text-body-lg text-muted">{notFound.support}</p>
      <div className="mt-4">
        <Button href={notFound.cta.href} size="lg">
          {notFound.cta.label}
        </Button>
      </div>
    </Container>
  );
}
