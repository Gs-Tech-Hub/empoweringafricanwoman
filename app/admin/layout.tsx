import Link from "next/link";
import Brand from "@/components/ui/brand";
import { auth, signOut } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log("[admin-layout] session check", { hasSession: Boolean(session), email: session?.user?.email });

  return (
    <div className="min-h-screen bg-brand-cream bg-marble">
      {session && (
        <header className="border-b border-brand-border bg-brand-light/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div>
              <Link href="/admin" className="inline-flex items-center">
                <Brand size="sm" />
                <span className="ml-2 text-base font-light uppercase tracking-widest text-brand-charcoal">Admin</span>
              </Link>
              {session.user.email && (
                <p className="text-xs text-brand-muted">{session.user.email}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-brand-muted transition hover:text-brand-primary"
              >
                View site
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm text-brand-primary transition hover:text-red-800"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      {session ? (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
