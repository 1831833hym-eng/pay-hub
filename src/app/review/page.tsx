"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { OrderTable } from "@/components/payments/order-table";
import { usePayments } from "@/lib/payments-store";

export default function ReviewListPage() {
  const { orders } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);

  const filtered = useMemo(() => {
    return orders.filter((item) => {
      const q = appliedQuery;
      if (
        q.orderNo &&
        !item.orderNo.toLowerCase().includes(q.orderNo.toLowerCase())
      )
        return false;
      if (
        q.feishuNo &&
        !item.feishuNo.toLowerCase().includes(q.feishuNo.toLowerCase())
      )
        return false;
      if (q.applyType && item.applyType !== q.applyType) return false;
      if (q.purpose && !item.purpose.includes(q.purpose)) return false;
      if (q.amount && !String(item.amount).includes(q.amount)) return false;
      return true;
    });
  }, [orders, appliedQuery]);

  return (
    <AppShell title="复核付款单">
      <QueryForm
        values={draftQuery}
        onChange={setDraftQuery}
        onSearch={() => setAppliedQuery(draftQuery)}
        onReset={() => {
          setDraftQuery(EMPTY_QUERY);
          setAppliedQuery(EMPTY_QUERY);
        }}
      />

      <Card>
        <CardContent className="pt-4">
          <div className="mb-3 text-sm text-ink-3">
            共 {filtered.length} 笔（只读，不可编辑）
          </div>
          <OrderTable
            rows={filtered}
            selectedIds={[]}
            onToggle={() => undefined}
            onToggleAll={() => undefined}
            viewBase="/review"
            showEdit={false}
            showSelect={false}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
