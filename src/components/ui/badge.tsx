import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  FEISHU_STATUS_META,
  ORDER_STATUS_META,
  type FeishuApprovalStatus,
  type PaymentOrderStatus,
} from "@/lib/payments-data";

export function StatusBadge({ status }: { status: PaymentOrderStatus }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        meta.bg,
        meta.tone
      )}
    >
      {meta.label}
    </span>
  );
}

export function FeishuStatusBadge({ status }: { status: FeishuApprovalStatus }) {
  const meta = FEISHU_STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        meta.bg,
        meta.tone
      )}
    >
      {meta.label}
    </span>
  );
}

export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600",
        className
      )}
    >
      {children}
    </span>
  );
}
