"use client";
import { useRouter } from "../../i18n/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/admin/orders"); }, [router]);
  return null;
}
