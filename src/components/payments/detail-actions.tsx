"use client";

import { cn } from "@/lib/utils";

/** 明细页底部居中上浮操作条 */
export function DetailActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      {/* 为固定底栏预留空间，避免遮挡内容 */}
      <div className="h-16" aria-hidden />
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 sm:pb-5",
          className
        )}
      >
        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200/80 bg-white/95 px-4 py-2.5 shadow-[0_8px_28px_rgba(15,23,42,0.12)] backdrop-blur">
          {children}
        </div>
      </div>
    </>
  );
}
