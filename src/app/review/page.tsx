"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { payments } from "@/lib/payments-data";
import { formatMoney } from "@/lib/utils";

export default function ReviewPage() {
  const pending = payments.filter((p) => p.status === "pending_review");
  const [activeId, setActiveId] = useState(pending[0]?.id ?? "");
  const [comment, setComment] = useState("材料齐全，额度与收款方信息校验通过。");
  const [result, setResult] = useState<"pass" | "reject" | null>(null);

  const active = payments.find((p) => p.id === activeId) ?? pending[0];

  return (
    <AppShell
      title="复核中心"
      description="付款单提交复核通过后，方可调用万里汇付款接口。请核对飞书审批要素与出款账户。"
      actions={
        <Link href="/payments">
          <Button variant="secondary">全部付款单</Button>
        </Link>
      }
    >
      {result ? (
        <div
          className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
            result === "pass"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {result === "pass"
            ? "复核通过：付款单已进入「待出款」，可前往万里汇出款模块提交。"
            : "复核驳回：已退回申请人/运营，需修正后重新提交。"}{" "}
          <Link
            href={result === "pass" ? "/worldfirst" : "/payments"}
            className="font-medium underline"
          >
            {result === "pass" ? "去万里汇出款" : "查看付款单"}
          </Link>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>待复核队列 · {pending.length}</CardTitle>
            <CardDescription>来自飞书审批生成的付款单</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pending.length === 0 ? (
              <div className="py-10 text-center text-sm text-ink-4">
                暂无待复核付款单
              </div>
            ) : (
              pending.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveId(item.id);
                    setResult(null);
                  }}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    active?.id === item.id
                      ? "border-brand-200 bg-brand-50/50"
                      : "border-slate-100 bg-surface-soft hover:border-brand-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink-1">{item.orderNo}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="mt-1 truncate text-xs text-ink-3">
                    {item.payeeName}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-brand-600">
                    {formatMoney(item.amount, item.currency)}
                  </div>
                </button>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          {active ? (
            <>
              <CardHeader>
                <CardTitle>复核详情 · {active.orderNo}</CardTitle>
                <CardDescription>
                  飞书实例 {active.feishuInstanceCode}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                  <Info label="申请人" value={active.applicant} />
                  <Info label="商户主体" value={active.merchantName} />
                  <Info label="收款方" value={active.payeeName} />
                  <Info
                    label="收款账户"
                    value={`${active.payeeBank} ${active.payeeAccountMasked}`}
                  />
                  <Info
                    label="付款金额"
                    value={formatMoney(active.amount, active.currency)}
                  />
                  <Info
                    label="折合人民币"
                    value={formatMoney(active.cnyEquivalent, "CNY")}
                  />
                  <Info
                    label="付款用途"
                    value={active.purpose}
                    className="sm:col-span-2"
                  />
                </dl>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-2">
                    复核意见
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => setResult("pass")}
                    disabled={active.status !== "pending_review"}
                  >
                    <Check className="h-4 w-4" />
                    复核通过并进入出款
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setResult("reject")}
                    disabled={active.status !== "pending_review"}
                  >
                    <X className="h-4 w-4" />
                    驳回
                  </Button>
                  <Link href={`/payments/${active.id}`}>
                    <Button variant="outline">查看完整轨迹</Button>
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-16 text-center text-ink-4">
              请选择左侧待复核付款单
            </CardContent>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

function Info({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs text-ink-4">{label}</dt>
      <dd className="mt-1 font-medium text-ink-1">{value}</dd>
    </div>
  );
}
