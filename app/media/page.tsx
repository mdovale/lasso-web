import type { Metadata } from "next";
import { getMedia, getPages } from "@/lib/content";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export function generateMetadata(): Metadata {
  const { media } = getPages();
  return { title: media.title, description: media.intro };
}

export default function MediaPage() {
  const { media: copy } = getPages();
  const items = getMedia();

  return (
    <>
      <PageHeader eyebrow="Media" title={copy.title} intro={copy.intro} />
      <Container wide className="py-16">
        <MediaGallery items={items} />
      </Container>
    </>
  );
}
