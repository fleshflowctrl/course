import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CourseMemberDashboard } from "@/components/course/CourseMemberDashboard";
import { Container } from "@/components/ui/Container";
import { createMetadata } from "@/lib/metadata";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = createMetadata({
  title: "Your course",
  description:
    "Sign in required. Stream all 30 perimenopause lessons — member area.",
});

export default async function CoursePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent("/course")}`);
  }

  return (
    <div className="bg-cream py-section-y lg:py-section-y-lg">
      <Container>
        <CourseMemberDashboard user={user} />
      </Container>
    </div>
  );
}
