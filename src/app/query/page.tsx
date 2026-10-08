"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  EMPTY_QUERY,
  QueryForm,
  type QueryValues,
} from "@/components/payments/query-form";
import { OrderTable } from "@/components/payments/order-table";
import { STATUS_META, type PaymentStatus } from "@/lib/payments-data";
import { Select, Label } from "@/components/ui/input";
import { usePayments } from "@/lib/payments-store";

const STATUS_OPTIONS: Array<PaymentStatus | ""> = [
  "",
  "pending_submit",
  "pending_review",
  "pending_pay",
  "pending_receipt",
  "completed",
  "review_rejected",
];

export default function QueryListPage() {
  const { orders } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [draftStatus, setDraftStatus] = useState<PaymentStatus | "">("");
  const [appliedStatus, setAppliedStatus] = useState<PaymentStatus | "">("");

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
      if (appliedStatus && item.status !== appliedStatus) return false;
      return true;
    });
  }, [orders, appliedQuery, appliedStatus]);

  return (
    <AppShell
      title="查询付款单"
      description="付款单全量查询引导页。查询条件与列表字段同提交/复核菜单；本页仅支持查看，不可编辑、提交或复核。"
    >
      <QueryForm
        values={draftQuery}
        onChange={setDraftQuery}
        onSearch={() => {
          setAppliedQuery(draftQuery);
          setAppliedStatus(draftStatus);
        }}
        onReset={() => {
          setDraftQuery(EMPTY_QUERY);
          setAppliedQuery(EMPTY_QUERY);
          setDraftStatus("");
          setAppliedStatus("");
        }}
        extraFields={
          <div>
            <Label>付款单状态</Label>
            <Select
              value={draftStatus}
              onChange={(e) =>
                setDraftStatus((e.target.value || "") as PaymentStatus | "")
              }
            >
              <option value="">全部状态</option>
              {STATUS_OPTIONS.filter(Boolean).map((s) => (
                <option key={s} value={s}>
                  {STATUS_META[s as PaymentStatus].label}
                </option>
              ))}
            </Select>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            付款单列表 · {filtered.length} 笔
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable
            rows={filtered}
            selectedIds={[]}
            onToggle={() => undefined}
            onToggleAll={() => undefined}
            viewBase="/query"
            showEdit={false}
            showSelect={false}
          />
        </CardContent>
      </Card>
    </AppShell>
  );
}
