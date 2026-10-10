"use client";

import { Label, Textarea } from "@/components/ui/input";
import type { HandleOpinion } from "@/lib/payments-data";
import { formatDate } from "@/lib/utils";

export function OpinionSection({
  history,
  value,
  onChange,
  editable,
  className,
  showHistory = true,
}: {
  history?: HandleOpinion[];
  value?: string;
  onChange?: (next: string) => void;
  editable?: boolean;
  className?: string;
  showHistory?: boolean;
}) {
  const records = showHistory ? (history ?? []) : [];

  return (
    <div className={className ?? "space-y-3 border-t border-slate-100 pt-4"}>
      <Label>处理意见</Label>
      {records.length > 0 ? (
        <div className="space-y-2">
          {records.map((item, idx) => (
            <div
              key={`${item.stage}-${item.at}-${idx}`}
              className="rounded-md border border-slate-200 bg-[#f7f8fa] px-3 py-2"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
                <span className="font-medium text-ink-2">{item.stage}</span>
                <span>{formatDate(item.at)}</span>
              </div>
              <div className="mt-1 text-sm text-ink-1">{item.content}</div>
            </div>
          ))}
        </div>
      ) : null}
      {editable ? (
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="填写本次处理意见"
        />
      ) : records.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-sm text-ink-4">
          暂无处理意见
        </div>
      ) : null}
    </div>
  );
}
