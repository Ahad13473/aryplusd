import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <LoginForm enabled={adminEnabled()} />
    </main>
  );
}
