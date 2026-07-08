import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70svh] flex-col items-center justify-center py-32 text-center">
      <p className="u-label text-sky">Error 404</p>
      <h1 className="u-display mt-5 text-5xl text-fg">Signal not found.</h1>
      <p className="mt-5 max-w-md text-fg-muted">
        The page you were looking for doesn&apos;t exist — it may have been moved or
        renamed.
      </p>
      <div className="mt-9">
        <Button href="/">Back to the homepage</Button>
      </div>
    </Container>
  );
}
