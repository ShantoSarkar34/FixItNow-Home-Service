"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { ProfileHeader } from "@/components/profile/profile-header";
import { AccountProfileForm } from "@/components/profile/account-profile-form";

export default function AdminProfilePage() {
  const { data: user, isLoading } = useSession();

  if (isLoading || !user) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }

  return (
    <div className="max-w-full">
      <ProfileHeader name={user.name} role={user.role} photo={user.photo} />
      <AccountProfileForm user={user} />
    </div>
  );
}