import type { CurrencyCode, RegionId } from "@/config/regions";
import DonationForm from "@/components/donation/DonationForm";

type DonationSectionProps = {
  regionId: RegionId;
  currency: CurrencyCode;
  presets: number[];
};

export function DonationSection({ regionId, currency, presets }: DonationSectionProps) {
  return (
    <section className="bg-brand-ivory py-16 md:py-24" id="donate">
      <div className="content-container">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div data-aos="fade-up">
            <p className="eyebrow mb-4">Give today</p>
            <div className="gold-divider mb-6 !mx-0" />
            <h2 className="section-heading mb-4">Fuel Lasting Change</h2>
            <p className="text-brand-muted leading-relaxed">
              Your gift supports education, skills training, and mentorship for African women. All
              donations are processed through a secure hosted checkout.
            </p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <DonationForm regionId={regionId} currency={currency} presets={presets} />
          </div>
        </div>
      </div>
    </section>
  );
}
