"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailForm } from "@/components/payments/detail-form";
import { usePayments } from "@/lib/payments-store";

export default function QueryDetailPage() {
  const params = useParams<{ id: string }>();
  const { getById } = usePayments();
  const order = getById(params.id);

  if (!order) {
    return (
      <AppShell title="查询付款单详情" description="未找到该付款单">
        <Card>
          <CardContent className="py-16 text-center text-ink-4">
            付款单不存在
            <div className="mt-4">
              <Link href="/query">
                <Button variant="secondary">返回列表</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="查询付款单详情"
      description="明细字段：付款单编号、飞书审批编号、付款申请类型、付款事由、付款金额、币种、申请人、申请时间、付款单状态。本页只读。"
      actions={
        <Link href="/query">
          <Button variant="secondary">返回列表</Button>
        </Link>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{order.orderNo}（只读）</CardTitle>
        </CardHeader>
        <CardContent>
          <DetailForm order={order} editable={false} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
