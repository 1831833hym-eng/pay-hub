"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import {
  APPLICATION_TYPES,
  payments,
  type PaymentApplicationType,
} from "@/lib/payments-data";
import { formatDate, formatMoney } from "@/lib/utils";

type Filters = {
  orderNo: string;
  feishuNo: string;
  applicationType: PaymentApplicationType | "all";
  purpose: string;
  amount: string;
};

const emptyFilters: Filters = {
  orderNo: "",
  feishuNo: "",
  applicationType: "all",
  purpose: "",
  amount: "",
};

export function PaymentGuideList() {
  const [draft, setDraft] = useState<Filters>(emptyFilters);
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const filtered = useMemo(() => {
    return payments.filter((item) => {
      const hitOrder =
        !filters.orderNo ||
        item.orderNo.toLowerCase().includes(filters.orderNo.trim().toLowerCase());
      const hitFeishu =
        !filters.feishuNo ||
        item.feishuInstanceCode
          .toLowerCase()
          .includes(filters.feishuNo.trim().toLowerCase());
      const hitType =
        filters.applicationType === "all" ||
        item.applicationType === filters.applicationType;
      const hitPurpose =
        !filters.purpose || item.purpose.includes(filters.purpose.trim());
      const hitAmount =
        !filters.amount ||
        String(item.amount).includes(filters.amount.trim()) ||
        formatMoney(item.amount, item.currency).includes(filters.amount.trim());
      return hitOrder && hitFeishu && hitType && hitPurpose && hitAmount;
    });
  }, [filters]);

  const onSearch = () => setFilters({ ...draft });
  const onReset = () => {
    setDraft(emptyFilters);
    setFilters(emptyFilters);
  };

  return (
    <AppShell
      title="付款中心"
      description="承接飞书审批付款申请，生成付款单；复核通过后经万里汇出款，并将回单回传飞书审批流。"
      actions={
        <>
          <Link href="/feishu">
            <Button variant="secondary">飞书审批承接</Button>
          </Link>
          <Link href="/review">
            <Button>去复核</Button>
          </Link>
        </>
      }
    >
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">查询条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div>
              <Label>付款单编号</Label>
              <Input
                placeholder="请输入付款单编号"
                value={draft.orderNo}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, orderNo: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>飞书审批编号</Label>
              <Input
                placeholder="请输入飞书审批编号"
                value={draft.feishuNo}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, feishuNo: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>付款申请类型</Label>
              <Select
                value={draft.applicationType}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    applicationType: e.target
                      .value as Filters["applicationType"],
                  }))
                }
              >
                <option value="all">全部类型</option>
                {APPLICATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>付款事由</Label>
              <Input
                placeholder="请输入付款事由"
                value={draft.purpose}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, purpose: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>付款金额</Label>
              <Input
                placeholder="请输入付款金额"
                value={draft.amount}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={onSearch}>
              <Search className="h-4 w-4" />
              查询
            </Button>
            <Button variant="outline" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-base">
            付款单列表 · 共 {filtered.length} 条
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-ink-4">
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  付款单编号
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  飞书审批编号
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  付款申请类型
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  付款事由
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  付款金额
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">币种</th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  申请人
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  申请时间
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  付款单状态
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  创建时间
                </th>
                <th className="pb-3 pr-3 font-medium whitespace-nowrap">
                  更新时间
                </th>
                <th className="pb-3 font-medium text-right whitespace-nowrap">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-3.5 pr-3 font-medium text-ink-1 whitespace-nowrap">
                    <Link
                      href={`/payments/${item.id}`}
                      className="text-brand-600 hover:underline"
                    >
                      {item.orderNo}
                    </Link>
                  </td>
                  <td className="py-3.5 pr-3 text-ink-2 whitespace-nowrap">
                    {item.feishuInstanceCode}
                  </td>
                  <td className="py-3.5 pr-3 text-ink-2 whitespace-nowrap">
                    {item.applicationType}
                  </td>
                  <td className="py-3.5 pr-3 text-ink-2 max-w-[200px]">
                    <span className="line-clamp-2">{item.purpose}</span>
                  </td>
                  <td className="py-3.5 pr-3 font-semibold text-brand-600 whitespace-nowrap">
                    {item.amount.toLocaleString("zh-CN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3.5 pr-3 text-ink-2 whitespace-nowrap">
                    {item.currency}
                  </td>
                  <td className="py-3.5 pr-3 text-ink-2 whitespace-nowrap">
                    {item.applicant}
                  </td>
                  <td className="py-3.5 pr-3 text-ink-3 whitespace-nowrap">
                    {formatDate(item.appliedAt)}
                  </td>
                  <td className="py-3.5 pr-3 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3.5 pr-3 text-ink-3 whitespace-nowrap">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="py-3.5 pr-3 text-ink-3 whitespace-nowrap">
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="py-3.5 text-right whitespace-nowrap">
                    <Link href={`/payments/${item.id}`}>
                      <Button variant="outline" size="sm">
                        明细
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-16 text-center text-ink-4">
                    没有匹配的付款单，请调整查询条件
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
