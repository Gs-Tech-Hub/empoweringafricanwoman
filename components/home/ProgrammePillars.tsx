import {
  Briefcase,
  Heart,
  GraduationCap,
  Stethoscope,
  Users,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { getContentSections, type PageContent } from "@/lib/content/site-content";

const iconMap: Record<string, LucideIcon> = {
  "book-open": BookOpen,
  briefcase: Briefcase,
  graduation: GraduationCap,
  heart: Heart,
  health: Stethoscope,
  users: Users,
};

export function ProgrammePillars({
  content,
}: {
  content: PageContent;
}) {
  const pillars = getContentSections(content, "pillar").map(({ id, fields }) => ({
    id,
    title: fields.title?.value ?? "",
    description: fields.description?.value ?? "",
    icon: fields.icon?.value ?? "book-open",
  })).filter((pillar) => pillar.title || pillar.description);

  if (!pillars.length) {
    return null;
  }

  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="content-container">
        <div className="mb-12 text-center" data-aos="fade-up">
          <p className="eyebrow mb-4">{content.pillars?.eyebrow?.value || "Programme pillars"}</p>
          <div className="gold-divider mb-6" />
          <h2 className="section-heading">
            {content.pillars?.title?.value || "Our focus"}
          </h2>
          {content.pillars?.description?.value ? (
            <p className="mx-auto mt-4 max-w-2xl text-brand-muted">
              {content.pillars.description.value}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon] ?? BookOpen;
            return (
              <article
                key={pillar.id}
                className="card-programme p-6"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-ivory text-brand-accent">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-heading text-lg font-semibold text-brand-charcoal">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
