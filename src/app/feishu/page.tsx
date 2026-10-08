"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FilePlus2, RefreshCw, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { FeishuStatusBadge, Pill } from "@/components/ui/badge";
import { feishuApprovals } from "@/lib/payments-data";
import { formatDate, formatMoney } from "@/lib/utils";

export default function FeishuIntakePage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [synced, setSynced] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return feishuApprovals.filter((item) => {
      const hitKeyword =
        !keyword ||
        item.title.includes(keyword) ||
        item.instanceCode.toLowerCase().includes(keyword.toLowerCase()) ||
        item.applicant.includes(keyword) ||
        item.payeeName.toLowerCase().includes(keyword.toLowerCase());
      const hitStatus = status === "all" || item.status === status;
      return hitKeyword && hitStatus;
    });
  }, [keyword, status]);

  const pendingGenerate = filtered.filter(
    (item) => item.status === "approved" && !item.linkedOrderId
  );

  return (
    <AppShell
      title="飞书审批承接"
      description="承接飞书付款审批通过信息，自动/手动生成付款单。审批中单据仅展示，不可生成。"
      actions={
        <Button
          onClick={() => {
            setSynced(true);
            setTimeout(() => setSynced(false), 2500);
          }}
        >
          <RefreshCw className="h-4 w-4" />
          {synced ? "已同步最新审批" : "同步飞书审批"}
        </Button>
      }
    >
      {synced ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          已从飞书拉取最新付款审批实例，共 {feishuApprovals.length} 条。
        </div>
      ) : null}
      {generatedId ? (
        <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
          已根据飞书审批生成付款单草稿，可前往{" "}
          <Link href="/review" className="font-medium underline">
            复核中心
          </Link>{" "}
          提交复核。（示意：{generatedId}）
        </div>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="font-display text-3xl font-bold text-brand-500">
              {feishuApprovals.filter((i) => i.status === "approved").length}
            </div>
            <div className="mt-1 text-sm text-ink-3">审批通过</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="font-display text-3xl font-bold text-amber-600">
              {pendingGenerate.length}
            </div>
            <div className="mt-1 text-sm text-ink-3">待生成付款单</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="font-display text-3xl font-bold text-emerald-600">
              {feishuApprovals.filter((i) => i.linkedOrderId).length}
            </div>
            <div className="mt-1 text-sm text-ink-3">已关联付款单</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="grid gap-3 pt-6 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-4" />
            <Input
              className="pl-9"
              placeholder="搜索审批标题 / 实例号 / 申请人 / 收款方"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">全部审批状态</option>
            <option value="approved">审批通过</option>
            <option value="approving">审批中</option>
            <option value="rejected">已驳回</option>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>飞书付款审批列表 · {filtered.length}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-ink-4">
                <th className="pb-3 font-medium">审批信息</th>
                <th className="pb-3 font-medium">申请人</th>
                <th className="pb-3 font-medium">收款方 / 金额</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium">付款单</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const canGenerate =
                  item.status === "approved" && !item.linkedOrderId;
                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="py-4">
                      <div className="font-medium text-ink-1">{item.title}</div>
                      <div className="mt-1 text-xs text-ink-4">
                        {item.instanceCode}
                      </div>
                      <div className="mt-1 text-xs text-ink-4">
                        通过时间 {formatDate(item.approvedAt)} · 附件{" "}
                        {item.attachmentCount}
                      </div>
                    </td>
                    <td className="py-4">
                      <div>{item.applicant}</div>
                      <div className="text-xs text-ink-4">{item.department}</div>
                    </td>
                    <td className="py-4">
                      <div className="text-ink-1">{item.payeeName}</div>
                      <div className="font-semibold text-brand-600">
                        {formatMoney(item.amount, item.currency)}
                      </div>
                    </td>
                    <td className="py-4">
                      <FeishuStatusBadge status={item.status} />
                    </td>
                    <td className="py-4">
                      {item.linkedOrderId ? (
                        <Link href={`/payments/${item.linkedOrderId}`}>
                          <Pill>已关联</Pill>
                        </Link>
                      ) : (
                        <span className="text-xs text-ink-4">未生成</span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {canGenerate ? (
                        <Button
                          size="sm"
                          onClick={() =>
                            setGeneratedId(`PAY-DRAFT-${item.id.toUpperCase()}`)
                          }
                        >
                          <FilePlus2 className="h-3.5 w-3.5" />
                          生成付款单
                        </Button>
                      ) : item.linkedOrderId ? (
                        <Link href={`/payments/${item.linkedOrderId}`}>
                          <Button variant="outline" size="sm">
                            查看付款单
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          等待审批通过
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
