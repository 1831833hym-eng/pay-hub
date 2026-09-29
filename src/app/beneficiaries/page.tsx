"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Pill } from "@/components/ui/badge";
import { beneficiaries } from "@/lib/payments-data";

export default function BeneficiariesPage() {
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    return beneficiaries.filter((item) => {
      const hitKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.country.includes(keyword) ||
        item.bankName.toLowerCase().includes(keyword.toLowerCase());
      const hitType = type === "all" || item.type === type;
      return hitKeyword && hitType;
    });
  }, [keyword, type]);

  return (
    <AppShell
      title="收款方管理"
      description="维护跨境供应商、物流商与服务商收款账户，完成 KYC 认证后方可发起付款。"
      actions={
        <Button>
          <Plus className="h-4 w-4" />
          新增收款方
        </Button>
      }
    >
      <Card className="mb-6">
        <CardContent className="grid gap-3 pt-6 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-4" />
            <Input
              className="pl-9"
              placeholder="搜索收款方名称 / 国家 / 银行"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">全部类型</option>
            <option value="供应商">供应商</option>
            <option value="物流商">物流商</option>
            <option value="服务商">服务商</option>
            <option value="个人">个人</option>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <Card key={item.id} className="transition hover:-translate-y-0.5">
            <CardHeader>
              <div className="mb-2 flex flex-wrap gap-2">
                <Pill>{item.type}</Pill>
                <Pill
                  className={
                    item.status === "已认证"
                      ? "bg-emerald-50 text-emerald-700"
                      : item.status === "审核中"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-ink-3"
                  }
                >
                  {item.status}
                </Pill>
              </div>
              <CardTitle className="leading-snug">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-ink-3">
              <div className="flex justify-between gap-3">
                <span>国家/地区</span>
                <span className="text-ink-1">{item.country}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>开户银行</span>
                <span className="text-right text-ink-1">{item.bankName}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>账号</span>
                <span className="text-ink-1">{item.accountMasked}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>结算币种</span>
                <span className="font-medium text-brand-600">{item.currency}</span>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={item.status !== "已认证"}
                >
                  {item.status === "已认证" ? "发起付款" : "待认证完成"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="py-16 text-center text-ink-4">
            没有匹配的收款方
          </CardContent>
        </Card>
      ) : null}
    </AppShell>
  );
}
