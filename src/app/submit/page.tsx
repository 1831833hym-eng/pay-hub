"use client";

import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { ConfirmDialog } from "@/components/payments/confirm-dialog";
import { OrderTable } from "@/components/payments/order-table";
import { usePayments } from "@/lib/payments-store";

export default function SubmitListPage() {
  const { orders, batchSubmit, batchVoid, voidOne } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [voidIds, setVoidIds] = useState<string[] | null>(null);
  const voidIdsRef = useRef<string[] | null>(null);
  voidIdsRef.current = voidIds;

  /** 初审菜单仅展示待提交单据；复核退回后的单也会回到本列表 */
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
    if (selectedIds.length === 0) return;
    batchSubmit(selectedIds);
    setSelectedIds([]);
  };

  const handleBatchVoid = () => {
    if (selectedIds.length === 0) return;
    setVoidIds(selectedIds);
  };

  const handleVoidOne = (id: string) => {
    setVoidIds([id]);
  };

  const confirmVoid = () => {
    const ids = voidIdsRef.current;
    if (!ids || ids.length === 0) return;
    if (ids.length === 1) {
      voidOne(ids[0]);
    } else {
      batchVoid(ids);
    }
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
    setVoidIds(null);
  };

  return (
    <AppShell title="初审付款单">
      <QueryForm
        values={draftQuery}
        onChange={setDraftQuery}
        onSearch={() => {
          setAppliedQuery(draftQuery);
        }}
        onReset={() => {
          setDraftQuery(EMPTY_QUERY);
          setAppliedQuery(EMPTY_QUERY);
        }}
      />

      <Card>
        <CardContent className="pt-4">
          <div className="mb-3 flex items-center justify-end gap-2">
            <Button variant="danger" onClick={handleBatchVoid}>
              作废
            </Button>
            <Button onClick={handleBatchSubmit}>批量提交</Button>
          </div>
          <OrderTable
            rows={filtered}
            selectedIds={selectedIds}
            showSelect
            showEdit
            showVoid
            viewBase="/submit"
            editBase="/submit"
            onVoid={handleVoidOne}
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

      <ConfirmDialog
        open={voidIds !== null}
        description="将作废付款单，请确认审批单是否已作废。"
        confirmText="确认"
        confirmVariant="danger"
        onConfirm={confirmVoid}
        onCancel={() => setVoidIds(null)}
      />
    </AppShell>
  );
}
