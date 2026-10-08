"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailForm } from "@/components/payments/detail-form";
import { Textarea, Label } from "@/components/ui/input";
import { usePayments } from "@/lib/payments-store";

export default function ReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const { getById, approve, reject, markPaid, markReceiptDone } = usePayments();
  const order = getById(params.id);
  const [remark, setRemark] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  if (!order) {
    return (
      <AppShell title="复核付款单详情" description="未找到该付款单">
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

  return (
    <AppShell
      title="复核付款单详情"
      description="明细字段与提交付款单一致；本页不可编辑修改，仅可进行复核通过/驳回及后续出款、回单操作。"
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
          <CardTitle className="text-base">{order.orderNo}（只读）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DetailForm order={order} editable={false} />

          {order.status === "pending_review" ? (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <div>
                <Label>复核意见</Label>
                <Textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="可选填写复核意见"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    approve(order.id);
                    setToast("复核通过，状态更新为「待付款」");
                  }}
                >
                  复核通过
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    reject(order.id, remark || undefined);
                    setToast("已驳回，状态更新为「复核驳回」");
                  }}
                >
                  复核驳回
                </Button>
              </div>
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
