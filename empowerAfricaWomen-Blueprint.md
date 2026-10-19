# Developer Guide: Empowering the African Woman

Implementation blueprint · Next.js · TypeScript · Netlify · Cursor + GitHub Copilot

This guide translates the approved website graphics into a production-ready implementation plan. The goal is to build a professional charity website that looks like the design, works on mobile, supports donors in Africa and Western countries, and can evolve into a complete fundraising platform.

The guiding principle is build the website as a reusable system, not as one large page copied from a graphic.

## 1. What we are building

[Voices United - Nonprofit Organization Website Design by Phenomenon Labs for Phenomenon Studio on Dribbble](https://images.openai.com/static-rsc-4/gwg0JMG0XrU3cQBxLXscrA0syUyJmX3J0W3SvgdNQHlwcXnMbi_Pp7Xc2_o8r41VzBUyiD8BJhUvOegVI530aYdo04n1oJZYdS2lr2p35esSWmc7cvtOIpiKsbCEHlOWs4J1WiebWLYTUh9yOG8uDFIxhWEhuJeQ9dRnJnlrtsI?purpose=inline)

[dribbble.com](https://dribbble.com/shots/26183245-Voices-United-Nonprofit-Organization-Website-Design?utm_source=chatgpt.com)

Visual identity

Match the approved graphics, photography, typography and spacing.

Fundraising

A clear donation journey with a secure, hosted checkout.

Regional experience

Africa, Canada, US and global visitor experiences.

Trust and reliability

Accessible pages, verified donation records and secure configuration.

### Agreed technical stack

| Layer                   | Technology                                |
| ----------------------- | ----------------------------------------- |
| Web framework           | Next.js App Router                        |
| Language                | TypeScript                                |
| Styling                 | Tailwind CSS                              |
| UI components           | Reusable React components                 |
| Icons                   | Lucide React                              |
| Typography              | Playfair Display + Inter                  |
| Hosting and deployment  | Netlify                                   |
| Version control         | GitHub                                    |
| AI-assisted development | Cursor + GitHub Copilot                   |
| Regional routing        | Netlify Edge Function                     |
| Payments                | Hosted checkout via an eligible provider  |
| Testing                 | Vitest, React Testing Library, Playwright |

Use compatible, stable package versions and verify the current Netlify/Next.js deployment requirements when creating the project. Avoid adding a component library merely for convenience when the design can be implemented cleanly with reusable components.

## 2. Turn the graphic into a real page

The generated graphic is a visual reference, not a source file for the website. Rebuild its sections using real HTML, CSS, React components and properly licensed photographs.

## Homepage section map

01 · HEADER

Logo · Navigation · Donate button

02 · HERO

Headline + supporting text + 2 CTAs + large portrait

03 · ABOUT / MISSION

Organisation story + mission + four programme pillars

04 · IMPACT

Verified outcomes or clearly labelled targets + photography

05 · PROGRAMMES + STORIES

Programme cards + real participant stories

06 · DONATION PANEL

Currency + amount + frequency + secure payment CTA

07 · FOOTER

Contact + governance + privacy + social links

The page should use a consistent maximum content width, generous white space, rounded photography, fine gold dividers and restrained shadows. On mobile, the split hero becomes a stacked layout, programme cards become a single column, and the donation button remains easy to reach.

## 3. Project folder structure

Create one Next.js application for all regions. Shared components and content should live in one codebase, with regional differences controlled by configuration rather than duplicated websites.

```
empowering-african-woman/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── africa/
│   │   └── page.tsx
│   ├── canada/
│   │   └── page.tsx
│   ├── us/
│   │   └── page.tsx
│   ├── global/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── programmes/
│   │   └── page.tsx
│   ├── impact/
│   │   └── page.tsx
│   ├── stories/
│   │   └── page.tsx
│   ├── donate/
│   │   ├── page.tsx
│   │   └── success/page.tsx
│   └── api/
│       └── donations/
│           └── route.ts
├── components/
│   ├── layout/
│   │   ├── SiteHeader.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── MobileMenu.tsx
│   │   └── RegionSelector.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ProgrammePillars.tsx
│   │   ├── ImpactSection.tsx
│   │   ├── StoriesSection.tsx
│   │   └── DonationSection.tsx
│   ├── donation/
│   │   ├── DonationForm.tsx
│   │   ├── AmountSelector.tsx
│   │   └── FrequencySelector.tsx
│   └── ui/
├── config/
│   ├── brand.ts
│   ├── regions.ts
│   └── navigation.ts
├── content/
│   ├── africa.ts
│   ├── canada.ts
│   ├── us.ts
│   └── global.ts
├── lib/
│   ├── payments/
│   ├── analytics/
│   └── validation/
├── public/
│   ├── logo/
│   ├── images/
│   └── icons/
├── netlify/
│   └── edge-functions/
│       └── region.ts
├── tests/
├── netlify.toml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

This is the proposed structure, not a requirement to create every file immediately. Build the homepage first, then add regional routing, payments and supporting pages in separate stages.

## 4. Design system: exact initial tokens

Create the design tokens before building the sections. This ensures that Cursor and Copilot use the same colours, fonts, spacing and button styles.

### Brand colours

Deep cocoa

\#542719

&#x20;Copy

Empowerment gold

\#DCA126

&#x20;Copy

Warm orange

\#B94E25

&#x20;Copy

Warm ivory

\#F5E8D5

&#x20;Copy

Page white

\#FBF9F5

&#x20;Copy

Suggested typography:

- Headings: Playfair Display, with a serif fallback.
- Body and interface: Inter, with a sans-serif fallback.
- Hero heading: responsive, approximately 44–64px on desktop and 36–44px on mobile.
- Body copy: 16–18px with comfortable line height.
- Buttons: medium or semibold text, clear contrast, consistent padding and rounded corners.

Create reusable design classes for primary and secondary buttons, section headings, eyebrow labels, content containers, programme cards and image treatments. Gold text on ivory should not be used for small text unless contrast has been checked.

## 5. Build the homepage components

Each section should have one responsibility. Keep content separate from presentation so the regional pages can reuse the same layout with different copy or currency settings.

| Component          | Implementation requirement                                  |
| ------------------ | ----------------------------------------------------------- |
| `SiteHeader`       | Responsive navigation, logo, region selector and Donate CTA |
| `HeroSection`      | Text and portrait grid, responsive image, two clear CTAs    |
| `AboutSection`     | Mission narrative and organisational values                 |
| `ProgrammePillars` | Four reusable icon-and-text items                           |
| `ImpactSection`    | Verified metrics, or explicit target labels                 |
| `StoriesSection`   | Reusable story cards with consented photography             |
| `DonationSection`  | Currency-aware donation form                                |
| `SiteFooter`       | Contact, policies, governance and social links              |

### Example: reusable hero component

Create `components/home/HeroSection.tsx`.

```
import Image from "next/image";
import Link from "next/link";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  donateHref: string;
  missionHref: string;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  donateHref,
  missionHref,
}: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="hero-description">{description}</p>

          <div className="hero-actions">
            <Link className="button button-primary" href={donateHref}>
              Donate Now
            </Link>
            <Link className="button button-secondary" href={missionHref}>
              Explore Our Mission
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
```

The associated CSS should implement the two-column desktop layout and a single-column mobile layout. The image should use `object-fit: cover` with a controlled aspect ratio and focal point. Use real, licensed photography rather than relying on the generated mockup as a background image.

Example usage in a regional page:

```
<HeroSection
  eyebrow="EMPOWERING THE AFRICAN WOMAN"
  title="Real Opportunities. Lasting Change."
  description="We support African women with education, skills, and resources to build brighter futures."
  image="/images/hero-woman.webp"
  imageAlt="African woman entrepreneur looking confidently ahead"
  donateHref="/donate"
  missionHref="/about"
/>
```

The text above is sample copy. Final mission statements should be approved by the organisation.

## 6. The Cursor + Copilot development workflow

Use Cursor as the primary implementation environment and GitHub Copilot as a second assistant for code completion, tests and review. Both tools should follow the same written project rules; do not let each independently redesign the architecture.

Step 1 — Give the tools the design brief

Add the approved graphics and project instructions to the repository.

Step 2 — Cursor builds the design system

Implement tokens, global styles, header, buttons and page containers.

Step 3 — Build one section at a time

Hero → About → Programmes → Impact → Stories → Donation → Footer.

Step 4 — Copilot reviews and tests

Check types, responsive behaviour, accessibility, broken links and tests.

Step 5 — Deploy to Netlify

Connect GitHub, configure environment variables and validate the production build.

### Set the repository rules

Create `AGENTS.md` at the repository root. Cursor and compatible coding agents can use it as shared project guidance.

\# Empowering the African Woman — Engineering Rules  ## Mission Build a premium, accessible, responsive charity website that faithfully follows the approved brand graphics.  ## Stack - Next.js App Router - TypeScript with strict checking - Tailwind CSS - React Server Components by default - Netlify hosting and Edge Functions - GitHub for source control  ## Design rules - Use the approved cocoa, gold, orange, ivory and white palette. - Use Playfair Display for headings and Inter for body text. - Use reusable components and centralised design tokens. - Follow the approved editorial layout and photography direction. - Do not use the full-page design graphic as the actual webpage. - Optimise all images and test desktop, tablet and mobile layouts.  ## Content rules - Never invent impact statistics, testimonials, registrations or partnerships. - Mark unverified metrics as targets or remove them. - Use authentic, appropriately licensed images and consented participant stories.  ## Architecture rules - Share components across regional pages. - Keep regional copy and currency configuration separate from presentation. - Use Netlify Edge Functions for country-based initial routing. - Preserve explicit visitor region preferences. - Keep payment credentials and privileged logic server-side. - Verify payment notifications before recording successful donations.  ## Quality rules - Use accessible semantic HTML and keyboard-friendly controls. - Validate inputs on the server. - Run linting, type checking, tests and a production build. - Never commit secrets, credentials or private donor data. - Make focused changes and explain significant architectural decisions.

## 7. Copy-and-paste prompts for Cursor and Copilot

The most effective workflow is to give Cursor a specific deliverable, inspect the implementation, then ask Copilot to review and test it. Avoid asking either tool to build the entire platform in one prompt.

### Prompt 1 — Initialise the project

Cursor

Use this first in Cursor Agent mode.

Inspect the repository and initialise the Empowering the African Woman website.  Use Next.js App Router, TypeScript strict mode, Tailwind CSS, and Lucide React. Prepare the project for deployment on Netlify.  Create the initial folder structure, global design tokens, font configuration for Playfair Display and Inter, shared layout, responsive header and footer.  Use the approved brand palette: - Cocoa #542719 - Gold #DCA126 - Orange #B94E25 - Ivory #F5E8D5 - White #FBF9F5  Follow AGENTS.md. Do not implement payment processing or regional redirects yet.  Run the available lint, type-check and production-build commands. Report created files, decisions and any errors. Do not claim a check passed unless it actually ran successfully.

&#x20;Copy prompt

### Prompt 2 — Recreate the landing page

Cursor

Using the approved Empowering the African Woman graphics as the visual reference, implement the homepage with reusable components.  Build the header, split hero, About Us/Mission, four programme pillars, impact section, programme cards, real-stories section, donation callout and footer.  Match the graphic's editorial typography, warm neutral backgrounds, dark-brown headings, gold buttons, image crops, generous spacing and responsive layout.  Use local image assets in public/images. If final photography is unavailable, use clearly identified temporary placeholders. Never fabricate statistics or testimonials.  Use semantic HTML, Next.js Image, accessible buttons and links, and responsive breakpoints. Keep sections in separate component files. Make the homepage visually faithful at desktop widths of 1440px and mobile widths of 390px.  Implement the actual sections rather than inserting a screenshot of the design. Run checks and report incomplete items.

&#x20;Copy prompt

### Prompt 3 — Review the implementation

Copilot

Review the current implementation against AGENTS.md and the approved charity website reference.  Do not redesign the site. Identify and fix specific issues with responsive layout, TypeScript types, accessibility, image loading, component duplication, broken navigation and inconsistent design tokens.  Add appropriate unit tests and Playwright tests for the main navigation, mobile menu and donation form interactions. Verify that placeholder impact figures and testimonials are not presented as verified facts.  Run the relevant test, lint, type-check and build commands. Summarise actual results, remaining issues and any checks that could not run.

&#x20;Copy prompt

## 8. Regional website and currency support

The project already has a regional strategy. Keep a single application and use four regional routes:

| Route     | Audience                     | Default currency                          |
| --------- | ---------------------------- | ----------------------------------------- |
| `/africa` | African visitors             | NGN for the Nigeria-focused donation flow |
| `/canada` | Canadian visitors            | CAD                                       |
| `/us`     | US visitors                  | USD                                       |
| `/global` | Other international visitors | USD                                       |

The currency defaults are presentation choices; the payment provider must confirm which currencies and settlement arrangements are supported.

Implement the regional experience in two stages:

1. Regional content: use shared components with different regional copy, donation defaults, contact details and calls to action.
2. Automatic routing: configure a Netlify Edge Function at `netlify/edge-functions/region.ts` and register it in `netlify.toml`. Use Netlify's country context to redirect only the root homepage on the first visit.

Preserve deep links, let visitors manually switch regions, and store their explicit choice in a `site-region` cookie for 180 days. Never repeatedly redirect someone who has chosen a different region.

Automatic routing should improve relevance, not restrict access. All regional pages should remain reachable directly.

## 9. Implement real donations safely

Do this only after the visual website and regional navigation work.

The donation flow should be:

\#chatgpt-mermaid-\_r_e9\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_e9\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_e9\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_e9\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_e9\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_e9\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_e9\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_e9\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_e9\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_e9\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_e9\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_e9\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_e9\_ p{margin:0;}#chatgpt-mermaid-\_r_e9\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_e9\_ .label text,#chatgpt-mermaid-\_r_e9\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ .node rect,#chatgpt-mermaid-\_r_e9\_ .node circle,#chatgpt-mermaid-\_r_e9\_ .node ellipse,#chatgpt-mermaid-\_r_e9\_ .node polygon,#chatgpt-mermaid-\_r_e9\_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ .rough-node .label text,#chatgpt-mermaid-\_r_e9\_ .node .label text,#chatgpt-mermaid-\_r_e9\_ .image-shape .label,#chatgpt-mermaid-\_r_e9\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_e9\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ .rough-node .label,#chatgpt-mermaid-\_r_e9\_ .node .label,#chatgpt-mermaid-\_r_e9\_ .image-shape .label,#chatgpt-mermaid-\_r_e9\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_e9\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_e9\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_e9\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_e9\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_e9\_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_e9\_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_e9\_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_e9\_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-\_r_e9\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_e9\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_e9\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_e9\_ .icon-shape,#chatgpt-mermaid-\_r_e9\_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_e9\_ .icon-shape p,#chatgpt-mermaid-\_r_e9\_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-\_r_e9\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_e9\_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_e9\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_e9\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_e9\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_e9\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_e9\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_e9\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_e9\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_e9\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_e9\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_e9\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_e9\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_e9\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_e9\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_e9\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ .node rect,#chatgpt-mermaid-\_r_e9\_ .node circle,#chatgpt-mermaid-\_r_e9\_ .node ellipse,#chatgpt-mermaid-\_r_e9\_ .node polygon,#chatgpt-mermaid-\_r_e9\_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_e9\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_e9\_ .node.mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_e9\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_e9\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_e9\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Visitor selects region anddonationDonation form validationServer validates amount andcurrencyCreate checkout with paymentproviderRedirect to hosted checkoutProvider confirms paymentVerify signed webhookserver-sideRecord verified donationShow confirmation and issuereceipt

Use an eligible payment provider, such as Paystack or Flutterwave, after confirming the organisation's account eligibility, currencies, fees and recurring-donation capabilities.

The `/api/donations` endpoint must validate amount, currency, frequency and campaign on the server. Do not trust totals supplied by the browser. Store API keys in Netlify environment variables, verify webhook signatures, handle duplicate events idempotently, and never mark a donation successful merely because the visitor returned to the success page.

Do not activate live donations until the organisational payment account, settlement details, privacy notice, receipts and test transactions have been verified.

## 10. Launch checklist

## Launch readiness

0/16 completed

Visual fidelity

Logo and typography match the brand

Hero, About and Impact sections match the reference

Mobile and desktop layouts reviewed

Content and trust

Mission and programmes approved

Impact metrics verified or labelled as targets

Photography licensed and participant consent obtained

Contact and governance details published

Technical quality

Production build and TypeScript checks pass

Navigation and forms tested

Accessibility and keyboard navigation checked

Images optimised and metadata configured

Regional and payment readiness

Regional redirects tested without loops

Manual region switching persists

Provider account and currency support confirmed

Webhook verification and duplicate-event handling tested

Live donation and receipt flow verified

## Recommended implementation order

1. Set up the GitHub repository, Next.js project and shared design system.
2. Recreate the homepage to match the approved graphics.
3. Complete the About, Programmes, Impact and Stories pages.
4. Implement regional content and Netlify georouting.
5. Integrate hosted donations and verified payment webhooks.
6. Test the complete experience, then deploy through Netlify.

The immediate next step is to build the static homepage faithfully before adding complex features. Once the design is approved in a running browser, the payment and regional systems can be layered in without compromising the visual experience.