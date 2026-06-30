import StudioSidebar from "@/components/layout/StudioSidebar";

export const metadata = {
  title: "SellBox Studio — Gestiona tu contenido",
  description:
    "Sube, gestiona y analiza tus videos en SellBox Studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <StudioSidebar />

      {/* Main content area — pushed right by the sidebar width */}
      <main className="md:ml-56 min-h-screen">
        {children}
      </main>
    </div>
  );
}
