"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CheckSquare,
  ClipboardList,
  FileSearch,
  Fullscreen,
  LayoutDashboard,
  Moon,
  Search,
  Settings,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENUS = [
  {
    href: "/submit",
    label: "提交付款单",
    icon: ClipboardList,
    match: (p: string) => p === "/" || p.startsWith("/submit"),
  },
  {
    href: "/review",
    label: "复核付款单",
    icon: CheckSquare,
    match: (p: string) => p.startsWith("/review"),
  },
  {
    href: "/query",
    label: "查询付款单",
    icon: FileSearch,
    match: (p: string) => p.startsWith("/query"),
  },
];

const RAIL = [
  { label: "工作台", icon: LayoutDashboard },
  { label: "站点", icon: Store },
  { label: "B2B", icon: Store },
];

function currentMenu(pathname: string) {
  return MENUS.find((m) => m.match(pathname)) ?? MENUS[0];
}

function breadcrumb(pathname: string) {
  const menu = currentMenu(pathname);
  const isDetail = /\/(submit|review|query)\/[^/]+/.test(pathname);
  return [
    "Fund",
    "付款中心",
    menu.label,
    ...(isDetail ? ["明细"] : []),
  ];
}

export function AppShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const crumbs = breadcrumb(pathname);

  return (
    <div className="flex min-h-screen bg-page text-ink-1">
      {/* Far-left icon rail */}
      <aside className="hidden w-14 shrink-0 flex-col items-center gap-2 bg-rail py-3 text-white/80 lg:flex">
        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
          F
        </div>
        {RAIL.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              title={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10"
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </aside>

      {/* Module sidebar */}
      <aside className="hidden w-[200px] shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="flex h-12 items-center px-4 text-base font-semibold tracking-wide">
          Fund
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {MENUS.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-brand-50 font-medium text-brand-600"
                    : "text-ink-2 hover:bg-slate-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4">
          <div className="min-w-0 flex-1 truncate text-xs text-ink-3 sm:text-sm">
            {crumbs.map((c, i) => (
              <span key={`${c}-${i}`}>
                {i > 0 ? <span className="mx-1.5 text-ink-4">&gt;</span> : null}
                <span className={i === crumbs.length - 1 ? "text-ink-1" : ""}>
                  {c}
                </span>
              </span>
            ))}
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-ink-4 md:flex">
            <Search className="h-3.5 w-3.5" />
            <span>搜索</span>
            <kbd className="rounded border border-slate-200 bg-white px-1 text-[10px]">
              ⌘K
            </kbd>
          </div>
          <div className="flex items-center gap-1 text-ink-3">
            <IconBtn>
              <Settings className="h-4 w-4" />
            </IconBtn>
            <IconBtn>
              <Moon className="h-4 w-4" />
            </IconBtn>
            <IconBtn>
              <Fullscreen className="h-4 w-4" />
            </IconBtn>
            <IconBtn>
              <Bell className="h-4 w-4" />
            </IconBtn>
            <div className="ml-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <UserRound className="h-3.5 w-3.5" />
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex h-10 shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-3">
          {MENUS.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex h-8 items-center gap-1.5 rounded-t-md border-b-2 px-3 text-xs transition-colors",
                  isActive
                    ? "border-brand-500 bg-brand-50/60 font-medium text-brand-600"
                    : "border-transparent text-ink-3 hover:bg-slate-50 hover:text-ink-1"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
                <X className="h-3 w-3 opacity-0 group-hover:opacity-50" />
              </Link>
            );
          })}
        </div>

        {/* Mobile menu */}
        <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 md:hidden">
          {MENUS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs whitespace-nowrap",
                  isActive
                    ? "bg-brand-50 font-medium text-brand-600"
                    : "bg-slate-50 text-ink-3"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="min-h-0 flex-1 overflow-auto p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-base font-semibold text-ink-1">{title}</h1>
              {description ? (
                <p className="mt-0.5 text-xs text-ink-3">{description}</p>
              ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
    >
      {children}
    </button>
  );
}
