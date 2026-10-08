"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Upload } from "lucide-react";
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
import { formatDate, formatMoney } from "@/lib/utils";

export default function ReceiptsPage() {
  const list = payments.filter((p) =>
    ["paid", "receipt_synced", "paying"].includes(p.status)
  );
  const [toast, setToast] = useState<string | null>(null);

  return (
    <AppShell
      title="回单回传飞书"
      description="付款完成后从万里汇获取回单，并上传至原飞书审批流附件，完成业务闭环。"
      actions={
        <Link href="/feishu">
          <Button variant="secondary">返回飞书承接</Button>
        </Link>
      }
    >
      {toast ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {toast}
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">获取回单</CardTitle>
            <CardDescription>
              调用万里汇回单查询/下载接口，保存 PDF/电子回单
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">上传飞书</CardTitle>
            <CardDescription>
              将回单作为附件写入原审批实例，并更新节点状态
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">闭环归档</CardTitle>
            <CardDescription>
              付款单标记为「回单已回传」，财务与审计可追溯
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>回单处理列表</CardTitle>
          <CardDescription>
            仅展示已进入万里汇出款或已付款的单据
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-ink-4">
                <th className="pb-3 font-medium">付款单</th>
                <th className="pb-3 font-medium">万里汇</th>
                <th className="pb-3 font-medium">回单</th>
                <th className="pb-3 font-medium">飞书审批</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-4">
                    <div className="font-medium text-ink-1">{item.orderNo}</div>
                    <div className="text-xs text-ink-4">
                      {formatMoney(item.amount, item.currency)} ·{" "}
                      {item.payeeName}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="text-ink-1">
                      {item.worldfirstTxId ?? "—"}
                    </div>
                    <div className="text-xs text-ink-4">
                      {item.worldfirstStatus ?? "—"}
                    </div>
                  </td>
                  <td className="py-4">
                    {item.receiptNo ? (
                      <>
                        <Pill>{item.receiptNo}</Pill>
                        {item.receiptSyncedAt ? (
                          <div className="mt-1 text-xs text-ink-4">
                            回传于 {formatDate(item.receiptSyncedAt)}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-xs text-ink-4">尚未获取</span>
                    )}
                  </td>
                  <td className="py-4 text-xs text-ink-3">
                    {item.feishuInstanceCode}
                  </td>
                  <td className="py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {item.status !== "receipt_synced" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setToast(
                                `已从万里汇拉取回单（示意），关联 ${item.orderNo}`
                              )
                            }
                          >
                            <Download className="h-3.5 w-3.5" />
                            获取回单
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              setToast(
                                `回单已上传至飞书审批 ${item.feishuInstanceCode}，流程闭环。`
                              )
                            }
                          >
                            <Upload className="h-3.5 w-3.5" />
                            回传飞书
                          </Button>
                        </>
                      ) : (
                        <Link href={`/payments/${item.id}`}>
                          <Button size="sm" variant="outline">
                            查看闭环轨迹
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
