import { adminGetSettings } from "@/lib/supabase/adminQueries";
import SettingsForm, { type SettingsData } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await adminGetSettings();
  const initial: SettingsData = {
    hero_title: s?.hero_title ?? "",
    hero_subtitle: s?.hero_subtitle ?? "",
    hero_image_url: s?.hero_image_url ?? "",
    logo_url: s?.logo_url ?? "",
  };
  return (
    <div>
      <h1 className="text-white text-2xl font-black mb-6">Site Settings</h1>
      <SettingsForm initial={initial} />
    </div>
  );
}
