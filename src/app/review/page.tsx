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
import { usePayments } from "@/lib/payments-store";

export default function ReviewListPage() {
  const { orders } = usePayments();
  const [draftQuery, setDraftQuery] = useState<QueryValues>(EMPTY_QUERY);
  const [appliedQuery, setAppliedQuery] = useState<QueryValues>(EMPTY_QUERY);

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
      // 复核菜单重点看待复核及之后状态；也允许查看全部便于对照
      return true;
    });
  }, [orders, appliedQuery]);

  return (
    <AppShell
      title="复核付款单"
      description="复核页面字段与提交付款单一致，但不可编辑修改。复核通过后状态更新为「待付款」，随后可走万里汇付款与回单回传。"
    >
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
        <CardHeader>
          <CardTitle className="text-base">
            付款单列表 · {filtered.length} 笔（只读）
          </CardTitle>
        </CardHeader>
        <CardContent>
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
