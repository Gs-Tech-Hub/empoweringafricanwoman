import type { Metadata } from "next";
import GetInvolvedForm from "@/components/get-involved/GetInvolvedForm";
import { getContentValue, getPageContent } from "@/lib/content/site-content";
import { getCurrentRegion } from "@/lib/region/get-current-region";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Learn how to volunteer or request approval for a fundraising or solicitation activity.",
};

export default async function GetInvolvedPage() {
  const region = await getCurrentRegion();
  const siteContent = await getPageContent("site", region);
  const email =
    getContentValue(siteContent, "contact", "email") ||
    getContentValue(siteContent, "footer", "email");

  return (
    <article className="bg-brand-cream">
      <header className="content-container py-16 text-center md:py-24">
        <p className="eyebrow mb-4">Make a difference</p>
        <div className="gold-divider mb-6" />
        <h1 className="section-heading">Get Involved</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-brand-muted">
          Share your skills or propose a fundraising activity in support of our work.
        </p>
      </header>

      <section className="content-container grid gap-6 pb-14 md:grid-cols-2 md:pb-20">
        <article className="card-programme p-6 md:p-8">
          <h2 className="font-heading text-2xl font-semibold text-brand-primary">
            Volunteering
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-brand-muted">
            <li>Tell us about your skills, availability, and the kind of support you can offer.</li>
            <li>Our team will review your expression of interest and consider current needs.</li>
            <li>If there is a suitable opportunity, the team will contact you to discuss next steps.</li>
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            Sending an enquiry does not guarantee a placement or create a volunteer relationship.
          </p>
        </article>

        <article className="card-programme p-6 md:p-8">
          <h2 className="font-heading text-2xl font-semibold text-brand-primary">
            Fundraising and solicitation requests
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-brand-muted">
            <li>Describe the proposed activity, its purpose, dates, channels, and any funds involved.</li>
            <li>Submit the details for review before announcing an affiliation or asking others to contribute.</li>
            <li>Wait for written approval before fundraising or using the organization’s name or logo.</li>
          </ol>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted">
            Sending a request is not approval to fundraise or solicit on the organization’s behalf.
          </p>
        </article>
      </section>

      <section id="interest-form" className="bg-brand-ivory py-14 md:py-20">
        <div className="content-container">
          <div className="mx-auto mb-8 max-w-2xl text-center">
            <p className="eyebrow mb-3">Start a conversation</p>
            <h2 className="font-heading text-3xl font-semibold text-brand-primary">
              Send an enquiry
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-muted">
              Complete the form and your email application will open with a prepared message.
              Your information is not stored on this website.
            </p>
          </div>
          <GetInvolvedForm contactEmail={email} />
        </div>
      </section>
    </article>
  );
}
