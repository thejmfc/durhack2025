"use client";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
    } else {
      setChecked(true);
    }
  }, [user, loading, pathname, router]);

  if (loading || !checked) return null;

  return <>{children}</>;
}
