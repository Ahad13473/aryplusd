import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { Dashboard } from "@/components/admin/dashboard";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <AdminShell active="stats">
      <Dashboard />
    </AdminShell>
  );
}
