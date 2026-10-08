"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailForm } from "@/components/payments/detail-form";
import type { PaymentOrder } from "@/lib/payments-data";
import { usePayments } from "@/lib/payments-store";

function SubmitDetailInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getById, updateOrder, submitOne, markPaid, markReceiptDone } =
    usePayments();
  const order = getById(params.id);
  const wantEdit = searchParams.get("mode") === "edit";
  const editable = Boolean(order && wantEdit && order.status === "pending_submit");
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

  return (
    <AppShell
      title={editable ? "编辑付款单" : "查看付款单"}
      description="明细字段：付款单编号、飞书审批编号、付款申请类型、付款事由、付款金额、币种、申请人、申请时间、付款单状态。"
      actions={
        <>
          <Link href="/submit">
            <Button variant="secondary">返回列表</Button>
          </Link>
          {order.status === "pending_submit" && !editable ? (
            <Link href={`/submit/${order.id}?mode=edit`}>
              <Button variant="outline">编辑</Button>
            </Link>
          ) : null}
        </>
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
          <DetailForm
            order={order}
            editable={editable}
            draft={draft}
            onChange={setDraft}
          />

          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {editable ? (
              <>
                <Button
                  onClick={() => {
                    updateOrder(order.id, {
                      feishuNo: draft.feishuNo,
                      applyType: draft.applyType,
                      purpose: draft.purpose,
                      amount: draft.amount,
                      currency: draft.currency,
                      applicant: draft.applicant,
                    });
                    setToast("保存成功");
                    router.replace(`/submit/${order.id}`);
                  }}
                >
                  保存
                </Button>
                <Button
                  onClick={() => {
                    updateOrder(order.id, {
                      feishuNo: draft.feishuNo,
                      applyType: draft.applyType,
                      purpose: draft.purpose,
                      amount: draft.amount,
                      currency: draft.currency,
                      applicant: draft.applicant,
                    });
                    submitOne(order.id);
                    setToast("已提交，状态更新为「待复核」");
                    router.push("/submit");
                  }}
                >
                  保存并提交
                </Button>
                <Link href={`/submit/${order.id}`}>
                  <Button variant="secondary">取消</Button>
                </Link>
              </>
            ) : (
              <>
                {order.status === "pending_submit" ? (
                  <Button
                    onClick={() => {
                      submitOne(order.id);
                      setToast("已提交，状态更新为「待复核」");
                    }}
                  >
                    提交复核
                  </Button>
                ) : null}
                {order.status === "pending_pay" ? (
                  <Button
                    onClick={() => {
                      markPaid(order.id);
                      setToast(
                        "已调用万里汇付款接口成功，状态更新为「待回单」"
                      );
                    }}
                  >
                    调用万里汇付款
                  </Button>
                ) : null}
                {order.status === "pending_receipt" ? (
                  <Button
                    onClick={() => {
                      markReceiptDone(order.id);
                      setToast(
                        "已获取万里汇回单并上传飞书审批流，状态更新为「已完成」"
                      );
                    }}
                  >
                    获取回单并回传飞书
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

export default function SubmitDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page-gradient p-10 text-center text-white">
          加载中…
        </div>
      }
    >
      <SubmitDetailInner />
    </Suspense>
  );
}
