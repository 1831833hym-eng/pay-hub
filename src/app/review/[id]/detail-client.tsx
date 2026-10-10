"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailActions } from "@/components/payments/detail-actions";
import { DetailForm } from "@/components/payments/detail-form";
import { HandleHistoryPanel } from "@/components/payments/handle-history-panel";
import { OpinionSection } from "@/components/payments/opinion-section";
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
  const [opinion, setOpinion] = useState("");
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
      <div className="space-y-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {isReviewMode ? "复核付款单详情" : "查看付款单详情"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DetailForm order={order} editable={false} />
          </CardContent>
        </Card>

        <HandleHistoryPanel history={order.handleOpinions} />

        {isReviewMode ? (
          <Card>
            <CardContent className="space-y-3 pt-4">
              <div className="max-w-xs">
                <Label>
                  付款渠道
                  <span className="ml-0.5 text-rose-500" aria-hidden>
                    *
                  </span>
                </Label>
                <Select
                  required
                  aria-required="true"
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
              <OpinionSection
                value={opinion}
                onChange={setOpinion}
                className="space-y-2"
              />
            </CardContent>
          </Card>
        ) : null}
      </div>

      <DetailActions>
        {isReviewMode ? (
          <>
            <Button
              onClick={() => {
                approve(order.id, paymentChannel, opinion);
                router.push("/review");
              }}
            >
              确认
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                reject(order.id, opinion);
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
