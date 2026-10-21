export const adminPages = [
  {
    id: "home",
    title: "Home",
    description: "Manage the homepage introduction, featured sections, and media.",
  },
  {
    id: "about",
    title: "About",
    description: "Manage the organisation story and page introduction.",
  },
  {
    id: "programmes",
    title: "Programmes",
    description: "Manage the programmes page introduction and supporting copy.",
    relatedTool: { href: "/admin/collections", label: "Manage programme content" },
  },
  {
    id: "impact",
    title: "Impact",
    description: "Manage the impact page introduction and supporting copy.",
  },
  {
    id: "stories",
    title: "Stories",
    description: "Manage the stories page introduction and supporting copy.",
    relatedTool: { href: "/admin/stories", label: "Manage stories" },
  },
  {
    id: "locations",
    title: "Locations",
    description: "Manage the locations page introduction and supporting copy.",
    relatedTool: { href: "/admin/locations", label: "Manage locations" },
  },
  {
    id: "donate",
    title: "Donate",
    description: "Manage the donation page introduction and supporting copy.",
  },
  {
    id: "site",
    title: "Site-wide content",
    description: "Manage shared contact details and content used across the website.",
  },
] as const;

export type AdminPageId = (typeof adminPages)[number]["id"];

export function isAdminPageId(value: string): value is AdminPageId {
  return adminPages.some((page) => page.id === value);
}
