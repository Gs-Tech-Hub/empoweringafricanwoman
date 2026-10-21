import Link from "next/link";
import { auth } from "@/lib/auth";
import { adminPages } from "@/config/admin-pages";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Dashboard",
};

const supportingTools = [
  {
    href: "/admin/media",
    label: "Media Library",
    description: "Upload and manage images, video, audio, and documents",
  },
  {
    href: "/admin/collections",
    label: "Programmes",
    description: "Add and remove programme content",
  },
  {
    href: "/admin/categories",
    label: "Programme Categories",
    description: "Organise programme content into categories",
  },
  {
    href: "/admin/stories",
    label: "Stories",
    description: "Manage stories featured on the website",
  },
  {
    href: "/admin/locations",
    label: "Locations",
    description: "Manage organisation locations shown on the website",
  },
];

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="section-subtitle">Admin</p>
        <h1 className="mt-2 font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal">
          Website pages
        </h1>
        <p className="mt-2 text-sm text-brand-muted">
          Signed in as {session.user.name ?? session.user.email}
        </p>
      </header>

      <section aria-labelledby="page-list-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-subtitle">Content management</p>
            <h2
              id="page-list-heading"
              className="mt-1 font-heading text-2xl font-light text-brand-charcoal"
            >
              Select a page
            </h2>
          </div>
          <Link
            href="/admin/content?page=home&region=global"
            className="text-sm font-medium text-brand-primary underline underline-offset-4"
          >
            Open page editor
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {adminPages.map((page) => (
            <article
              key={page.id}
              className="card-luxury flex min-h-48 flex-col items-start p-6"
            >
              <h3 className="font-heading text-xl font-light uppercase tracking-wider text-brand-charcoal">
                {page.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                {page.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Link
                  href={`/admin/content?page=${page.id}&region=global`}
                  className="text-sm font-medium text-brand-primary underline underline-offset-4"
                >
                  Edit page content
                </Link>
                {"relatedTool" in page ? (
                  <Link
                    href={page.relatedTool.href}
                    className="text-sm text-brand-muted underline underline-offset-4 hover:text-brand-primary"
                  >
                    {page.relatedTool.label}
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="supporting-tools-heading">
        <div className="mb-4">
          <p className="section-subtitle">Supporting tools</p>
          <h2
            id="supporting-tools-heading"
            className="mt-1 font-heading text-2xl font-light text-brand-charcoal"
          >
            Other content
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {supportingTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="card-luxury p-5 transition duration-300 hover:border-brand-secondary hover:shadow-luxury"
            >
              <h3 className="font-heading text-lg font-light uppercase tracking-wider text-brand-charcoal">
                {tool.label}
              </h3>
              <p className="mt-2 text-sm text-brand-muted">{tool.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
