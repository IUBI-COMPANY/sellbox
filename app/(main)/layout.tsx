import { createClient } from "@/lib/supabase/server";
import BottomTabs from "@/components/layout/BottomTabs";
import Sidebar from "@/components/layout/Sidebar";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check auth status on the server
  let user = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // If Supabase isn't configured yet, continue without auth
  }

  const userPayload = user
    ? {
        email: user.email,
        user_metadata: user.user_metadata as {
          full_name?: string;
          avatar_url?: string;
        },
      }
    : null;

  return (
    <MainLayoutWrapper sidebar={<Sidebar />} bottomTabs={<BottomTabs />}>
      {children}
    </MainLayoutWrapper>
  );
}
