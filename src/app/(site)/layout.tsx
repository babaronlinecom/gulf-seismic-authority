import { Header } from "@/components/gulf/header";
import { Footer } from "@/components/gulf/footer";
import { WhatsAppFab } from "@/components/gulf/whatsapp-fab";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
