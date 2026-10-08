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

export default function SubmitListPage() {
  const { orders, batchSubmit } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  /** 提交菜单仅展示待提交单据；复核退回后的单也会回到本列表 */
  const filtered = useMemo(() => {
    return orders.filter((item) => {
      if (item.status !== "pending_submit") return false;
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

  const handleBatchSubmit = () => {
    if (selectedIds.length === 0) {
      setToast("请先勾选待提交的付款单");
      return;
    }
    const count = batchSubmit(selectedIds);
    setSelectedIds([]);
    setToast(`已批量提交 ${count} 笔付款单，状态更新为「待复核」`);
  };

  return (
    <AppShell title="提交付款单">
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
            <Button onClick={handleBatchSubmit}>批量提交</Button>
          </div>
          <OrderTable
            rows={filtered}
            selectedIds={selectedIds}
            showSelect
            showEdit
            viewBase="/submit"
            editBase="/submit"
            onToggle={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id)
                  ? prev.filter((x) => x !== id)
                  : [...prev, id]
              )
            }
            onToggleAll={(ids) => setSelectedIds(ids)}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
