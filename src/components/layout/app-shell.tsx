import { TopNav } from "@/components/layout/top-nav";

export function AppShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-page-gradient">
      <TopNav />
      <main className="mx-auto max-w-[1280px] px-4 pb-16 pt-6 sm:px-6">
        <section className="mb-6 animate-fade-up rounded-2xl bg-white px-6 py-5 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-xl font-semibold text-ink-1 sm:text-2xl">
                {title}
              </h1>
              <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-ink-3">
                {description}
              </p>
            </div>
            {actions ? (
              <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
            ) : null}
          </div>
        </section>
        <div className="animate-fade-up [animation-delay:80ms]">{children}</div>
      </main>
    </div>
  );
}
