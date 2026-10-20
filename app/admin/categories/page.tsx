export const metadata = {
  title: "Manage Programme Categories",
};

import { auth } from "@/lib/auth";
import { getAdminCategories } from "@/lib/queries";
import CategoryForm from "@/components/admin/category-form";
import CategoryList from "@/components/admin/category-list";
import { redirect } from "next/navigation";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal">
          Programme categories
        </h1>
        <p className="mt-2 text-brand-muted">
          Organize published programmes into categories.
        </p>
      </div>

      <CategoryForm />
      <CategoryList categories={categories} />
    </div>
  );
}
