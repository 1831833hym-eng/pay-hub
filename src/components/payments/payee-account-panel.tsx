"use client";

import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/input";
import type { PaymentOrder } from "@/lib/payments-data";
import { cn } from "@/lib/utils";

export function PayeeAccountPanel({
  order,
  className,
}: {
  order: PaymentOrder;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="py-2.5">
        <CardTitle className="text-base">收款账户信息</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="账户类型">
            <Value>{order.payeeAccountType || "—"}</Value>
          </Field>
          <Field label="收款人/户名">
            <Value>{order.payeeName || "—"}</Value>
          </Field>
          <Field label="收款账号">
            <Value>{order.payeeAccountNo || "—"}</Value>
          </Field>
          <Field label="收款银行">
            <Value>{order.payeeBank || "—"}</Value>
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Value({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-8 text-sm leading-6 text-ink-1">{children || "—"}</div>
  );
}
