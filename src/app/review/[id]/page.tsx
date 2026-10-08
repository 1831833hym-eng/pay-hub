"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailForm } from "@/components/payments/detail-form";
import { usePayments } from "@/lib/payments-store";

export default function ReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getById, approve, reject, markPaid, markReceiptDone } = usePayments();
  const order = getById(params.id);
  const [toast, setToast] = useState<string | null>(null);

  if (!order) {
    return (
      <AppShell title="复核付款单明细" description="未找到该付款单">
        <Card>
          <CardContent className="py-16 text-center text-ink-4">
            付款单不存在
            <div className="mt-4">
              <Link href="/review">
                <Button variant="secondary">返回列表</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  const canReview = order.status === "pending_review";

  return (
    <AppShell
      title={canReview ? "复核付款单明细" : "查看付款单"}
      description="明细字段只读，不可编辑修改。"
      actions={
        <Link href="/review">
          <Button variant="secondary">返回列表</Button>
        </Link>
      }
    >
      {toast ? (
        <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {toast}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{order.orderNo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DetailForm order={order} editable={false} />

          {canReview ? (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Button
                onClick={() => {
                  approve(order.id);
                  setToast("已确认，状态更新为「待付款」");
                  router.push("/review");
                }}
              >
                确认
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  reject(order.id);
                  setToast("已退回，状态更新为「待提交」");
                  router.push("/review");
                }}
              >
                退回
              </Button>
              <Link href="/review">
                <Button variant="secondary">取消</Button>
              </Link>
            </div>
          ) : null}

          {order.status === "pending_pay" ? (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Button
                onClick={() => {
                  markPaid(order.id);
                  setToast("万里汇付款接口调用成功，状态更新为「待回单」");
                }}
              >
                调用万里汇付款接口
              </Button>
            </div>
          ) : null}

          {order.status === "pending_receipt" ? (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Button
                onClick={() => {
                  markReceiptDone(order.id);
                  setToast("已获取回单并上传飞书审批流，状态更新为「已完成」");
                }}
              >
                获取回单并回传飞书
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </AppShell>
  );
}
