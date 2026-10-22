import Link from "next/link";
import type { PageContent } from "@/lib/content/site-content";

type ProgrammesSectionProps = {
  content: PageContent;
};

export function ProgrammesSection({ content }: ProgrammesSectionProps) {
  if (
    !content.programmes?.title?.value &&
    !content.programmes?.description?.value &&
    !content.programmes?.eyebrow?.value
  ) {
    return null;
  }

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="content-container">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div data-aos="fade-up">
            {content.programmes?.eyebrow?.value ? (
              <p className="eyebrow mb-4">{content.programmes.eyebrow.value}</p>
            ) : null}
            <div className="gold-divider mb-6 !mx-0" />
            <h2 className="section-heading">{content.programmes?.title?.value || "Programmes"}</h2>
            {content.programmes?.description?.value ? (
              <p className="mt-4 max-w-xl text-brand-muted">
                {content.programmes.description.value}
              </p>
            ) : null}
          </div>
          <Link href="/programmes" className="button-secondary">
            View planned events
          </Link>
        </div>
      </div>
    </section>
  );
}
