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

  /** 复核菜单仅展示待复核单据 */
  const filtered = useMemo(() => {
    return orders.filter((item) => {
      if (item.status !== "pending_review") return false;
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
      if (
        q.paymentMethodType &&
        item.paymentMethodType !== q.paymentMethodType
      )
        return false;
      return true;
    });
  }, [orders, appliedQuery]);

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) {
      setToast("请先勾选待复核的付款单");
      return;
    }
    const count = batchApprove(selectedIds);
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
            onToggleAll={(ids) => setSelectedIds(ids)}
            viewBase="/review"
            showEdit={false}
            showReview
            showSelect
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
