"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import {
  payments,
  STATUS_META,
  type PaymentStatus,
} from "@/lib/payments-data";
import { formatDate, formatMoney } from "@/lib/utils";

const STATUS_FILTERS: Array<PaymentStatus | "all"> = [
  "all",
  "pending_review",
  "paying",
  "success",
  "failed",
  "rejected",
  "draft",
];

export default function PaymentsPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "all">("all");
  const [currency, setCurrency] = useState("all");

  const filtered = useMemo(() => {
    return payments.filter((item) => {
      const hitKeyword =
        !keyword ||
        item.orderNo.toLowerCase().includes(keyword.toLowerCase()) ||
        item.merchantName.includes(keyword) ||
        item.beneficiaryName.toLowerCase().includes(keyword.toLowerCase());
      const hitStatus = status === "all" || item.status === status;
      const hitCurrency = currency === "all" || item.currency === currency;
      return hitKeyword && hitStatus && hitCurrency;
    });
  }, [keyword, status, currency]);

  return (
    <AppShell
      title="付款单管理"
      description="按状态、币种与商户查询付款单，支持进入详情进行审核、重试或补充材料。"
      actions={
        <Link href="/payments/create">
          <Button>
            <Plus className="h-4 w-4" />
            新建付款
          </Button>
        </Link>
      }
    >
      <Card className="mb-6">
        <CardContent className="grid gap-3 pt-6 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-4" />
            <Input
              className="pl-9"
              placeholder="搜索付款单号 / 商户 / 收款方"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as PaymentStatus | "all")
            }
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "全部状态" : STATUS_META[s].label}
              </option>
            ))}
          </Select>
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="all">全部币种</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="HKD">HKD</option>
            <option value="SGD">SGD</option>
            <option value="JPY">JPY</option>
            <option value="CNY">CNY</option>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>付款单列表 · {filtered.length} 笔</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-ink-4">
                <th className="pb-3 font-medium">付款单号</th>
                <th className="pb-3 font-medium">商户 / 收款方</th>
                <th className="pb-3 font-medium">金额</th>
                <th className="pb-3 font-medium">用途</th>
                <th className="pb-3 font-medium">状态</th>
                <th className="pb-3 font-medium">申请时间</th>
                <th className="pb-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-4 font-medium text-ink-1">{item.orderNo}</td>
                  <td className="py-4">
                    <div className="text-ink-1">{item.merchantName}</div>
                    <div className="text-xs text-ink-4">
                      {item.beneficiaryName}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-brand-600">
                      {formatMoney(item.amount, item.currency)}
                    </div>
                    <div className="text-xs text-ink-4">
                      ≈ {formatMoney(item.cnyEquivalent, "CNY")}
                    </div>
                  </td>
                  <td className="py-4 text-ink-2">{item.purpose}</td>
                  <td className="py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-4 text-ink-3">{formatDate(item.createdAt)}</td>
                  <td className="py-4 text-right">
                    <Link href={`/payments/${item.id}`}>
                      <Button variant="outline" size="sm">
                        详情
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-ink-4">
                    没有匹配的付款单，请调整筛选条件
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
