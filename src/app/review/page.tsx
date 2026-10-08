"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { OrderTable } from "@/components/payments/order-table";
import { usePayments } from "@/lib/payments-store";

export default function ReviewListPage() {
  const { orders, batchApprove } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

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

  const selectable = filtered.filter((o) => o.status === "pending_review");

  const handleBatchApprove = () => {
    const ids = selectedIds.filter((id) =>
      selectable.some((o) => o.id === id)
    );
    if (ids.length === 0) {
      setToast("请先勾选状态为「待复核」的付款单");
      return;
    }
    const count = batchApprove(ids);
    setSelectedIds([]);
    setToast(`已批量复核通过 ${count} 笔付款单，状态更新为「待付款」`);
  };

  return (
    <AppShell title="复核付款单">
      {toast ? (
        <div className="mb-3 rounded-md border border-brand-200 bg-brand-50 px-3 py-2 text-sm text-brand-700">
          {toast}
        </div>
      ) : null}

      <QueryForm
        values={draftQuery}
        onChange={setDraftQuery}
        onSearch={() => {
          setAppliedQuery(draftQuery);
          setToast(null);
        }}
        onReset={() => {
          setDraftQuery(EMPTY_QUERY);
          setAppliedQuery(EMPTY_QUERY);
          setToast(null);
        }}
      />

      <Card>
        <CardContent className="pt-4">
          <div className="mb-3 flex items-center justify-end">
            <Button onClick={handleBatchApprove}>批量复核</Button>
          </div>
          <OrderTable
            rows={filtered}
            selectedIds={selectedIds}
            onToggle={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : [...prev, id]
              )
            }
            onToggleAll={(ids) => {
              const reviewIds = ids.filter((id) =>
                filtered.some(
                  (o) => o.id === id && o.status === "pending_review"
                )
              );
              setSelectedIds(reviewIds.length ? reviewIds : ids);
            }}
            viewBase="/review"
            showEdit={false}
            showSelect
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
