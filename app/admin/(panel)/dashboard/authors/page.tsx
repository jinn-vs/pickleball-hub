import { adminListAuthors } from "@/lib/supabase/adminQueries";
import EntityManager from "@/components/admin/EntityManager";

export const dynamic = "force-dynamic";

export default async function AuthorsAdminPage() {
  const rows = await adminListAuthors();
  return (
    <EntityManager
      title="Authors"
      endpoint="/api/authors"
      rows={rows}
      fields={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug", auto: "slug-from" },
        { key: "bio", label: "Bio", type: "textarea" },
        { key: "photo_url", label: "Photo URL" },
      ]}
    />
  );
}
