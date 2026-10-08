"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { OrderTable } from "@/components/payments/order-table";
import { STATUS_FLOW } from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

export default function SubmitListPage() {
  const { orders, batchSubmit } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((item) => {
      const q = appliedQuery;
      if (q.orderNo && !item.orderNo.toLowerCase().includes(q.orderNo.toLowerCase()))
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

  const selectable = filtered.filter((o) => o.status === "pending_submit");

  const handleBatchSubmit = () => {
    const ids = selectedIds.filter((id) =>
      selectable.some((o) => o.id === id)
    );
    if (ids.length === 0) {
      setToast("请先勾选状态为「待提交」的付款单");
      return;
    }
    const count = batchSubmit(ids);
    setSelectedIds([]);
    setToast(`已批量提交 ${count} 笔付款单，状态更新为「待复核」`);
  };

  return (
    <AppShell
      title="提交付款单"
      description="承接飞书审批付款申请并生成付款单。待提交单据可编辑后批量提交复核；提交后状态由待提交变更为待复核。"
    >
      {toast ? (
        <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {toast}
        </div>
      ) : null}

      <Card className="mb-6">
        <CardContent className="flex flex-wrap gap-2 pt-5">
          {STATUS_FLOW.map((s) => (
            <span
              key={s.key}
              className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
            >
              {s.label}
            </span>
          ))}
        </CardContent>
      </Card>

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
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">
            付款单列表 · {filtered.length} 笔
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleBatchSubmit}>批量提交</Button>
          </div>
        </CardHeader>
        <CardContent>
          <OrderTable
            rows={filtered}
            selectedIds={selectedIds}
            showSelect
            showEdit
            viewBase="/submit"
            editBase="/submit"
            onToggle={(id) =>
              setSelectedIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              )
            }
            onToggleAll={(ids) => setSelectedIds(ids)}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
