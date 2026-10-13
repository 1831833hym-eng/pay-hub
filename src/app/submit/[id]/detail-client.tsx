"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailActions } from "@/components/payments/detail-actions";
import { DetailForm } from "@/components/payments/detail-form";
import { HandleHistoryPanel } from "@/components/payments/handle-history-panel";
import { PayeeAccountPanel } from "@/components/payments/payee-account-panel";
import { OpinionSection } from "@/components/payments/opinion-section";
import type { PaymentOrder } from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

function SubmitDetailInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getById, submitOne, resyncOne, updateOrder } = usePayments();
  const order = getById(params.id);
  const isEditMode =
    searchParams.get("mode") === "edit" && order?.status === "pending_submit";
  const [draft, setDraft] = useState<PaymentOrder | undefined>(order);
  const [opinion, setOpinion] = useState("");

  useEffect(() => {
    setDraft(order);
  }, [order]);

  if (!order || !draft) {
    return (
      <AppShell title="付款单详情" description="未找到该付款单">
        <Card>
          <CardContent className="py-16 text-center text-ink-4">
            付款单不存在或已删除
            <div className="mt-4">
              <Link href="/submit">
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
      title={isEditMode ? "初审付款单明细" : "查看付款单"}
      actions={
        <Link href="/submit">
          <Button variant="secondary">返回列表</Button>
        </Link>
      }
    >
      <div className="space-y-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">基础信息</CardTitle>
          </CardHeader>
          <CardContent>
            <DetailForm
              order={order}
              draft={isEditMode ? draft : undefined}
              editable={false}
              memoEditable={isEditMode}
              channelBesideStatus
              onChange={
                isEditMode
                  ? (next) => {
                      setDraft(next);
                      updateOrder(order.id, {
                        transferMemo: next.transferMemo,
                      });
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>

        <PayeeAccountPanel order={order} />

        <HandleHistoryPanel history={order.handleOpinions} />

        {isEditMode ? (
          <Card>
            <CardContent className="pt-4">
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
        {isEditMode ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                resyncOne(order.id);
              }}
            >
              重新同步
            </Button>
            <Button
              onClick={() => {
                submitOne(order.id, opinion, draft.transferMemo);
                router.push("/submit");
              }}
            >
              提交复核
            </Button>
            <Link href="/submit">
              <Button variant="secondary">关闭</Button>
            </Link>
          </>
        ) : (
          <Link href="/submit">
            <Button variant="secondary">关闭</Button>
          </Link>
        )}
      </DetailActions>
    </AppShell>
  );
}

export default function SubmitDetailClient() {
  return (
    <Suspense
      fallback={
        <AppShell title="付款单详情">
          <Card>
            <CardContent className="py-16 text-center text-ink-4">
              加载中…
            </CardContent>
          </Card>
        </AppShell>
      }
    >
      <SubmitDetailInner />
    </Suspense>
  );
}
