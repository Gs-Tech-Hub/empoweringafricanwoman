export const metadata = {
  title: "Manage Programmes",
};

import { auth } from "@/lib/auth";
import { getAdminCategories, getAdminCollectionItems } from "@/lib/queries";
import CollectionForm from "@/components/admin/collection-form";
import CollectionList from "@/components/admin/collection-list";
import { redirect } from "next/navigation";

export default async function AdminCollectionsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const [categories, items] = await Promise.all([
    getAdminCategories(),
    getAdminCollectionItems(),
  ]);

  const serializedItems = items.map((item) => ({
    ...item,
    price: item.price?.toString() ?? null,
  }));

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal">
          Programmes
        </h1>
        <p className="mt-2 text-brand-muted">
          Add programme records and approve drafts before publishing them to the site.
        </p>
      </div>

      <CollectionForm categories={categories} />
      <CollectionList items={serializedItems} />
    </div>
  );
}
