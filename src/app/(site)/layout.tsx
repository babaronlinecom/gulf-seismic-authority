import { Header } from "@/components/gulf/header";
import { Footer } from "@/components/gulf/footer";
import { WhatsAppFab } from "@/components/gulf/whatsapp-fab";
import { getSiteSettings, getMenuItems } from "@/lib/cms";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch CMS-managed content (with seed fallbacks for build safety)
  const [settings, headerMenu, footerMenu] = await Promise.all([
    getSiteSettings(),
    getMenuItems("header"),
    getMenuItems("footer"),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} menuItems={headerMenu} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} menuItems={footerMenu} />
      <WhatsAppFab whatsapp={settings.whatsapp} phone={settings.phone} />
    </div>
  );
}
