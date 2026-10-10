"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailActions } from "@/components/payments/detail-actions";
import { DetailForm } from "@/components/payments/detail-form";
import { Label, Select } from "@/components/ui/input";
import {
  DEFAULT_PAYMENT_CHANNEL,
  PAYMENT_CHANNELS,
  type PaymentChannel,
} from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

function ReviewDetailInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getById, approve, reject } = usePayments();
  const order = getById(params.id);
  const [toast, setToast] = useState<string | null>(null);
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>(
    order?.paymentChannel ?? DEFAULT_PAYMENT_CHANNEL
  );

  if (!order) {
    return (
      <AppShell title="付款单明细" description="未找到该付款单">
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

  const isReviewMode =
    searchParams.get("mode") === "review" && order.status === "pending_review";

  return (
    <AppShell
      title="付款单明细"
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
          <CardTitle className="text-base">复核付款单详情</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DetailForm order={order} editable={false} />

          {isReviewMode ? (
            <div className="max-w-xs border-t border-slate-100 pt-4">
              <Label>付款渠道</Label>
              <Select
                value={paymentChannel}
                onChange={(e) =>
                  setPaymentChannel(e.target.value as PaymentChannel)
                }
              >
                {PAYMENT_CHANNELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <DetailActions>
        {isReviewMode ? (
          <>
            <Button
              onClick={() => {
                approve(order.id, paymentChannel);
                setToast(
                  `已确认（付款渠道：${paymentChannel}），状态更新为「待付款」`
                );
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
          </>
        ) : null}
        <Link href="/review">
          <Button variant="secondary">关闭</Button>
        </Link>
      </DetailActions>
    </AppShell>
  );
}

export default function ReviewDetailClient() {
  return (
    <Suspense
      fallback={
        <AppShell title="付款单明细">
          <Card>
            <CardContent className="py-16 text-center text-ink-4">
              加载中…
            </CardContent>
          </Card>
        </AppShell>
      }
    >
      <ReviewDetailInner />
    </Suspense>
  );
}
