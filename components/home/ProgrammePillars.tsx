import {
  Briefcase,
  GraduationCap,
  HeartPulse,
  Users,
  type LucideIcon,
} from "lucide-react";
import { programmePillars } from "@/config/impact";

const iconMap: Record<(typeof programmePillars)[number]["icon"], LucideIcon> = {
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  "heart-pulse": HeartPulse,
  users: Users,
};

export function ProgrammePillars() {
  return (
    <section className="bg-brand-cream py-16 md:py-24">
      <div className="content-container">
        <div className="mb-12 text-center" data-aos="fade-up">
          <p className="eyebrow mb-4">Programme pillars</p>
          <div className="gold-divider mb-6" />
          <h2 className="section-heading">How We Create Change</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programmePillars.map((pillar, index) => {
            const Icon = iconMap[pillar.icon];
            return (
              <article
                key={pillar.title}
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
