"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailActions } from "@/components/payments/detail-actions";
import { DetailForm } from "@/components/payments/detail-form";
import { HandleHistoryPanel } from "@/components/payments/handle-history-panel";
import { PayeeAccountPanel } from "@/components/payments/payee-account-panel";
import { usePayments } from "@/lib/payments-store";

export default function QueryDetailClient() {
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
      actions={
        <Link href="/query">
          <Button variant="secondary">返回列表</Button>
        </Link>
      }
    >
      <div className="space-y-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">查看付款单详情</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailForm order={order} editable={false} />
          </CardContent>
        </Card>

        <PayeeAccountPanel order={order} />

        <HandleHistoryPanel history={order.handleOpinions} />
      </div>

      <DetailActions>
        <Link href="/query">
          <Button variant="secondary">关闭</Button>
        </Link>
      </DetailActions>
    </AppShell>
  );
}
