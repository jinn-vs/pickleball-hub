import { adminListCategories } from "@/lib/supabase/adminQueries";
import EntityManager from "@/components/admin/EntityManager";

export const dynamic = "force-dynamic";

export default async function CategoriesAdminPage() {
  const rows = await adminListCategories();
  return (
    <EntityManager
      title="Categories"
      endpoint="/api/categories"
      rows={rows}
      fields={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug", auto: "slug-from" },
        { key: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
