import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogManager } from "@/components/admin/blog-manager";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <AdminShell active="blog">
      <BlogManager />
    </AdminShell>
  );
}
