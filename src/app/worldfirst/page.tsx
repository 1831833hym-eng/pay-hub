"use client";

import Link from "next/link";
import { useState } from "react";
import { Send, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge, Pill } from "@/components/ui/badge";
import { payments } from "@/lib/payments-data";
import { formatMoney } from "@/lib/utils";

export default function WorldFirstPage() {
  const queue = payments.filter((p) =>
    ["ready_to_pay", "paying", "pay_failed", "paid", "receipt_synced"].includes(
      p.status
    )
  );
  const [message, setMessage] = useState<string | null>(null);

  return (
    <AppShell
      title="万里汇出款"
      description="复核通过的付款单通过万里汇付款接口出款；失败可修正后重推，成功后等待回单。"
      actions={
        <Link href="/receipts">
          <Button variant="secondary">查看回单回传</Button>
        </Link>
      }
    >
      {message ? (
        <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          {message}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat
          label="待提交万里汇"
          value={String(payments.filter((p) => p.status === "ready_to_pay").length)}
        />
        <Stat
          label="出款处理中"
          value={String(payments.filter((p) => p.status === "paying").length)}
        />
        <Stat
          label="出款失败待重试"
          value={String(payments.filter((p) => p.status === "pay_failed").length)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>万里汇出款队列</CardTitle>
          <CardDescription>
            调用 WorldFirst Transfer API（原型示意），异步查询交易状态
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-surface-soft px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink-1">{item.orderNo}</span>
                  <StatusBadge status={item.status} />
                  {item.worldfirstTxId ? (
                    <Pill>TX {item.worldfirstTxId}</Pill>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-ink-3">
                  {item.payeeName} · {formatMoney(item.amount, item.currency)}
                </p>
                <p className="mt-1 text-xs text-ink-4">
                  飞书 {item.feishuInstanceCode}
                  {item.worldfirstStatus
                    ? ` · 万里汇状态 ${item.worldfirstStatus}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.status === "ready_to_pay" ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      setMessage(
                        `已调用万里汇付款接口提交 ${item.orderNo}，等待异步回调。`
                      )
                    }
                  >
                    <Send className="h-3.5 w-3.5" />
                    提交万里汇付款
                  </Button>
                ) : null}
                {item.status === "pay_failed" ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      setMessage(
                        `已重新推送 ${item.orderNo} 至万里汇付款接口。`
                      )
                    }
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    失败重试
                  </Button>
                ) : null}
                {item.status === "paying" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setMessage(
                        `已查询万里汇交易 ${item.worldfirstTxId}，仍为处理中。`
                      )
                    }
                  >
                    刷新出款状态
                  </Button>
                ) : null}
                <Link href={`/payments/${item.id}`}>
                  <Button size="sm" variant="outline">
                    详情
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center">
        <div className="font-display text-3xl font-bold text-brand-500">
          {value}
        </div>
        <div className="mt-1 text-sm text-ink-3">{label}</div>
      </CardContent>
    </Card>
  );
}
