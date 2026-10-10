"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailActions } from "@/components/payments/detail-actions";
import { DetailForm } from "@/components/payments/detail-form";
import type { PaymentOrder } from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

function SubmitDetailInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getById, updateOrder, submitOne } = usePayments();
  const order = getById(params.id);
  const isEditMode =
    searchParams.get("mode") === "edit" && order?.status === "pending_submit";
  const [draft, setDraft] = useState<PaymentOrder | undefined>(order);
  const [toast, setToast] = useState<string | null>(null);

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

  const savePatch = {
    applyType: draft.applyType,
    purpose: draft.purpose,
    amount: draft.amount,
    currency: draft.currency,
    applicant: draft.applicant,
    appliedAt: draft.appliedAt,
    paymentMethodType: draft.paymentMethodType,
    payeeAccountType: draft.payeeAccountType,
    payeeAccountNo: draft.payeeAccountNo,
    payeeBank: draft.payeeBank,
    transferMemo: draft.transferMemo || draft.feishuNo,
  };

  return (
    <AppShell
      title={isEditMode ? "初审付款单明细" : "查看付款单"}
      actions={
        <Link href="/submit">
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
          <CardTitle className="text-base">
            {isEditMode ? "初审付款单详情" : "查看付款单详情"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DetailForm
            order={order}
            editable={isEditMode}
            draft={draft}
            onChange={setDraft}
          />
        </CardContent>
      </Card>

      <DetailActions>
        {isEditMode ? (
          <>
            <Button
              onClick={() => {
                updateOrder(order.id, savePatch);
                setToast("保存成功");
              }}
            >
              保存
            </Button>
            <Button
              onClick={() => {
                updateOrder(order.id, savePatch);
                submitOne(order.id);
                setToast("已提交，状态更新为「待复核」");
                router.push("/submit");
              }}
            >
              保存并提交
            </Button>
          </>
        ) : null}
        <Link href="/submit">
          <Button variant="secondary">关闭</Button>
        </Link>
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
