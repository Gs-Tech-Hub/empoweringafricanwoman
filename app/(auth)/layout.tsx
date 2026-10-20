export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen grow flex-col bg-brand-cream">{children}</main>
  );
}
