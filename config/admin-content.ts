export type ContentFieldKind =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "date"
  | "url"
  | "event-status"
  | "media"
  | "icon"
  | "status";

export type ContentFieldDefinition = {
  field: string;
  label: string;
  kind?: ContentFieldKind;
  required?: boolean;
  help?: string;
};

export type FixedContentGroup = {
  section: string;
  title: string;
  description?: string;
  fields: readonly ContentFieldDefinition[];
};

export type RepeatableContentGroup = {
  prefix: string;
  title: string;
  description: string;
  itemLabel: string;
  fields: readonly ContentFieldDefinition[];
};

export type PageContentDefinition = {
  description?: string;
  fixed: readonly FixedContentGroup[];
  repeatable: readonly RepeatableContentGroup[];
};

const pageHeader: FixedContentGroup = {
  section: "page",
  title: "Page header",
  description: "The title and introduction shown at the top of this public page.",
  fields: [
    { field: "eyebrow", label: "Eyebrow" },
    { field: "title", label: "Main heading" },
    { field: "description", label: "Introduction", kind: "textarea" },
  ],
};

const commonSections: RepeatableContentGroup[] = [
  {
    prefix: "section",
    title: "Page sections",
    description:
      "These sections render below the page header. Add one section at a time; its identifier is used as the stable content key.",
    itemLabel: "Section",
    fields: [
      { field: "eyebrow", label: "Eyebrow" },
      { field: "title", label: "Section heading" },
      {
        field: "body",
        label: "Main content",
        kind: "textarea",
        help: "The page displays body first, then falls back to Content or Description when body is empty.",
      },
      { field: "content", label: "Content (fallback)", kind: "textarea" },
      { field: "description", label: "Description (fallback)", kind: "textarea" },
      { field: "media", label: "Section image or media", kind: "media" },
    ],
  },
  {
    prefix: "value",
    title: "Page cards",
    description: "Cards displayed after the page sections.",
    itemLabel: "Card",
    fields: [
      { field: "title", label: "Card heading" },
      { field: "description", label: "Card content", kind: "textarea" },
    ],
  },
];

const peopleGroups: FixedContentGroup[] = [
  {
    section: "founder",
    title: "Founder profile",
    description:
      "Shown on the About page and homepage when a founder name or biography is provided.",
    fields: [
      { field: "eyebrow", label: "Eyebrow" },
      { field: "title", label: "Profile heading" },
      { field: "name", label: "Name" },
      { field: "role", label: "Role" },
      { field: "bio", label: "Biography", kind: "textarea" },
      { field: "media", label: "Portrait", kind: "media" },
    ],
  },
  {
    section: "team",
    title: "Team section heading",
    description: "Heading and introduction shown above the team member cards.",
    fields: [
      { field: "eyebrow", label: "Eyebrow" },
      { field: "title", label: "Section heading" },
      { field: "description", label: "Introduction", kind: "textarea" },
      { field: "media", label: "Team image", kind: "media" },
    ],
  },
];

const teamMembers: RepeatableContentGroup = {
  prefix: "team",
  title: "Team members",
  description: "Each saved team member appears as a card when their name is provided.",
  itemLabel: "Team member",
  fields: [
    { field: "name", label: "Name" },
    { field: "role", label: "Role" },
    { field: "bio", label: "Biography", kind: "textarea" },
    { field: "order", label: "Display order" },
    { field: "media", label: "Portrait", kind: "media" },
  ],
};

const plannedEvents: RepeatableContentGroup = {
  prefix: "planned-event",
  title: "Planned events",
  description: "Upcoming events and their dates, locations, and practical details.",
  itemLabel: "Planned event",
  fields: [
    { field: "title", label: "Event title", required: true },
    { field: "date", label: "Event date", kind: "date", required: true },
    { field: "time", label: "Event time" },
    { field: "location", label: "Location" },
    { field: "details", label: "Event details", kind: "textarea" },
    { field: "registrationUrl", label: "Registration link", kind: "url" },
    { field: "media", label: "Event image", kind: "media" },
    {
      field: "status",
      label: "Publication status",
      kind: "event-status",
      help: "Keep as draft until the event information is confirmed.",
    },
    { field: "order", label: "Display order" },
  ],
};

const completedEvents: RepeatableContentGroup = {
  prefix: "impact-event",
  title: "Completed events",
  description: "Events that have taken place, with outcomes, photos, and YouTube videos.",
  itemLabel: "Completed event",
  fields: [
    { field: "title", label: "Event title", required: true },
    { field: "date", label: "Event date", kind: "date", required: true },
    { field: "location", label: "Location" },
    { field: "details", label: "Event outcomes and details", kind: "textarea" },
    {
      field: "youtubeUrl",
      label: "YouTube video URL",
      kind: "url",
      help: "Paste a YouTube watch, short, or embed link.",
    },
    { field: "media", label: "Event image or video", kind: "media" },
    {
      field: "status",
      label: "Publication status",
      kind: "event-status",
      help: "Keep as draft until the event details and outcomes are confirmed.",
    },
    { field: "order", label: "Display order" },
  ],
};

export const adminContentDefinitions: Record<string, PageContentDefinition> = {
  home: {
    description: "Homepage sections, profile content, and featured media.",
    fixed: [
      {
        section: "hero",
        title: "Hero",
        description: "The main heading, introduction, and featured media at the top of the homepage.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Main heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
          { field: "media", label: "Hero image or video", kind: "media" },
        ],
      },
      {
        section: "about",
        title: "Mission section",
        description: "Homepage mission statement and supporting introduction.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "lead", label: "Main content", kind: "textarea" },
        ],
      },
      ...peopleGroups,
      {
        section: "pillars",
        title: "Programme pillars heading",
        description: "Heading shown above the homepage programme pillar cards.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
      {
        section: "impact",
        title: "Impact section heading",
        description: "Heading shown above the impact cards. Do not publish unverified metrics.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
      {
        section: "programmes",
        title: "Featured programmes heading",
        description: "The programme cards themselves are managed in Programmes.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
      {
        section: "activities",
        title: "Activities section heading",
        description: "Activity cards only display when they have an image or video.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
      {
        section: "stories",
        title: "Featured stories heading",
        description: "The story cards themselves are managed in Stories.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
      {
        section: "donation",
        title: "Donation callout",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
      {
        section: "contact",
        title: "Contact details",
        description:
          "Edit the shared contact information shown in the website header and footer. These values are also available under Site-wide content.",
        fields: [
          { field: "email", label: "Email address", kind: "email" },
          { field: "phone", label: "Phone number", kind: "tel" },
          { field: "address", label: "Postal address", kind: "textarea" },
        ],
      },
      {
        section: "social",
        title: "Social media links",
        description:
          "Edit the shared social profile links shown on the website. These values are also available under Site-wide content.",
        fields: [
          { field: "facebook", label: "Facebook URL", kind: "url" },
          { field: "instagram", label: "Instagram URL", kind: "url" },
          { field: "x", label: "X URL", kind: "url" },
          { field: "linkedin", label: "LinkedIn URL", kind: "url" },
          { field: "youtube", label: "YouTube URL", kind: "url" },
        ],
      },
    ],
    repeatable: [
      {
        prefix: "pillar",
        title: "Programme pillars",
        description: "Cards shown under the homepage Programme pillars heading.",
        itemLabel: "Pillar",
        fields: [
          { field: "title", label: "Card heading" },
          { field: "description", label: "Card content", kind: "textarea" },
          { field: "icon", label: "Icon", kind: "icon" },
        ],
      },
      {
        prefix: "target",
        title: "Impact cards",
        description:
          "Impact values must be verified or clearly identified as targets before publication.",
        itemLabel: "Impact card",
        fields: [
          { field: "label", label: "Label" },
          { field: "value", label: "Value" },
          { field: "description", label: "Context", kind: "textarea" },
          { field: "status", label: "Status", kind: "status" },
        ],
      },
      {
        prefix: "activity",
        title: "Activities",
        description: "Activity cards require an image or video to appear on the homepage.",
        itemLabel: "Activity",
        fields: [
          { field: "title", label: "Card heading" },
          { field: "description", label: "Card content", kind: "textarea" },
          { field: "media", label: "Activity image or video", kind: "media" },
        ],
      },
      {
        prefix: "value",
        title: "Mission cards",
        description: "Cards displayed beneath the homepage mission statement.",
        itemLabel: "Mission card",
        fields: [
          { field: "title", label: "Card heading" },
          { field: "description", label: "Card content", kind: "textarea" },
        ],
      },
      teamMembers,
    ],
  },
  about: {
    description: "About page introduction, editorial sections, founder profile, and team.",
    fixed: [pageHeader, ...peopleGroups],
    repeatable: commonSections.concat(teamMembers),
  },
  programmes: {
    description: "Programme information and planned event details.",
    fixed: [
      pageHeader,
      {
        section: "planned-events",
        title: "Planned events heading",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
    ],
    repeatable: [...commonSections, plannedEvents],
  },
  impact: {
    description: "Impact page introduction and editorial sections.",
    fixed: [
      pageHeader,
      {
        section: "impact",
        title: "Impact section",
        description: "Heading displayed above the impact cards on this page.",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
      {
        section: "completed-events",
        title: "Completed events heading",
        fields: [
          { field: "eyebrow", label: "Eyebrow" },
          { field: "title", label: "Section heading" },
          { field: "description", label: "Introduction", kind: "textarea" },
        ],
      },
    ],
    repeatable: [
      ...commonSections,
      completedEvents,
      {
        prefix: "target",
        title: "Impact cards",
        description:
          "Impact values must be verified or clearly identified as targets before publication.",
        itemLabel: "Impact card",
        fields: [
          { field: "label", label: "Label" },
          { field: "value", label: "Value" },
          { field: "description", label: "Context", kind: "textarea" },
          { field: "status", label: "Status", kind: "status" },
        ],
      },
    ],
  },
  stories: {
    description: "Stories page introduction and editorial sections.",
    fixed: [pageHeader],
    repeatable: commonSections,
  },
  locations: {
    description: "Locations page introduction and editorial sections.",
    fixed: [pageHeader],
    repeatable: commonSections,
  },
  donate: {
    description: "Donation page introduction and editorial sections.",
    fixed: [pageHeader],
    repeatable: commonSections,
  },
  site: {
    description: "Shared contact and social information used across the website.",
    fixed: [
      {
        section: "contact",
        title: "Contact details",
        description: "Edit the contact information displayed across the public website.",
        fields: [
          { field: "email", label: "Email address", kind: "email" },
          { field: "phone", label: "Phone number", kind: "tel" },
          { field: "address", label: "Postal address", kind: "textarea" },
        ],
      },
      {
        section: "social",
        title: "Social media links",
        fields: [
          { field: "facebook", label: "Facebook URL" },
          { field: "instagram", label: "Instagram URL" },
          { field: "x", label: "X URL" },
          { field: "linkedin", label: "LinkedIn URL" },
          { field: "youtube", label: "YouTube URL" },
        ],
      },
    ],
    repeatable: [],
  },
};
