"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "付款中心", match: (p: string) => p === "/" },
  {
    href: "/feishu",
    label: "飞书审批承接",
    match: (p: string) => p.startsWith("/feishu"),
  },
  {
    href: "/payments",
    label: "付款单",
    match: (p: string) => p.startsWith("/payments"),
  },
  {
    href: "/review",
    label: "复核中心",
    match: (p: string) => p.startsWith("/review"),
  },
  {
    href: "/worldfirst",
    label: "万里汇出款",
    match: (p: string) => p.startsWith("/worldfirst"),
  },
  {
    href: "/receipts",
    label: "回单回传",
    match: (p: string) => p.startsWith("/receipts"),
  },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#f3f4f6]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-display text-lg font-bold text-brand-500"
        >
          资金中台
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto md:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm transition-colors whitespace-nowrap",
                  active
                    ? "bg-white text-ink-1 shadow-sm font-medium"
                    : "text-ink-3 hover:bg-white/70 hover:text-ink-1"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 text-sm text-ink-2">
          <span className="hidden sm:inline text-ink-4">跨境电商 · 资金中台</span>
          <div className="flex items-center gap-2 rounded-full bg-white px-2.5 py-1.5 shadow-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <UserRound className="h-3.5 w-3.5" />
            </span>
            <span className="pr-1">管理员</span>
          </div>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-slate-200/60 px-4 py-2 md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs whitespace-nowrap",
                active
                  ? "bg-white text-ink-1 shadow-sm font-medium"
                  : "text-ink-3 bg-white/40"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
