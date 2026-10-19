/** All figures are organisational targets until independently verified. */
export const impactTargets = [
  {
    id: "women-trained",
    label: "Women in skills training (target)",
    value: "500+",
    description: "Target participants across vocational and digital skills programmes.",
  },
  {
    id: "communities",
    label: "Communities reached (target)",
    value: "12",
    description: "Target communities with active programme presence.",
  },
  {
    id: "mentorship",
    label: "Mentorship hours (target)",
    value: "2,000",
    description: "Target hours of one-to-one and group mentorship delivered annually.",
  },
  {
    id: "microgrants",
    label: "Micro-grants (target)",
    value: "100",
    description: "Target small grants to support women-led enterprise starts.",
  },
] as const;

export const programmePillars = [
  {
    title: "Education",
    description: "Scholarships, literacy, and learning pathways for girls and women.",
    icon: "graduation-cap" as const,
  },
  {
    title: "Skills & Livelihoods",
    description: "Vocational training and employability for sustainable income.",
    icon: "briefcase" as const,
  },
  {
    title: "Health & Wellbeing",
    description: "Access to health information, support networks, and safe spaces.",
    icon: "heart-pulse" as const,
  },
  {
    title: "Leadership",
    description: "Mentorship and civic participation to amplify women's voices.",
    icon: "users" as const,
  },
] as const;
