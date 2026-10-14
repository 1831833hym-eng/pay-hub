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
import { ConfirmDialog } from "@/components/payments/confirm-dialog";
import { OrderTable } from "@/components/payments/order-table";
import {
  VOID_NOT_REJECTED_MESSAGE,
  VOID_REJECTED_MESSAGE,
} from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

export default function SubmitListPage() {
  const { orders, batchSubmit, voidOne } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [voidMessage, setVoidMessage] = useState<string | null>(null);

  /** 初审菜单仅展示待初审单据；复核退回后的单也会回到本列表 */
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

  const handleVoidOne = (id: string) => {
    const order = orders.find((item) => item.id === id);
    if (order?.approvalRejected) {
      voidOne(id);
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
      setVoidMessage(VOID_REJECTED_MESSAGE);
      return;
    }
    setVoidMessage(VOID_NOT_REJECTED_MESSAGE);
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
            <Button onClick={handleBatchSubmit}>批量初审</Button>
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
        open={voidMessage !== null}
        description={voidMessage ?? ""}
        closeOnly
        onCancel={() => setVoidMessage(null)}
      />
    </AppShell>
  );
}
