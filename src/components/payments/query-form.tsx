"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import {
  APPLY_TYPES,
  PAYMENT_METHOD_TYPES,
  PAYMENT_METHOD_TYPE_META,
} from "@/lib/payments-data";

export type QueryValues = {
  orderNo: string;
  feishuNo: string;
  applyType: string;
  purpose: string;
  amount: string;
  paymentMethodType: string;
};

export const EMPTY_QUERY: QueryValues = {
  orderNo: "",
  feishuNo: "",
  applyType: "",
  purpose: "",
  amount: "",
  paymentMethodType: "",
};

export function QueryForm({
  values,
  onChange,
  onSearch,
  onReset,
  extraFields,
}: {
  values: QueryValues;
  onChange: (next: QueryValues) => void;
  onSearch: () => void;
  onReset: () => void;
  extraFields?: React.ReactNode;
}) {
  const set = (key: keyof QueryValues, value: string) =>
    onChange({ ...values, [key]: value });

  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
          <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div>
              <Label>付款单编号</Label>
              <Input
                value={values.orderNo}
                onChange={(e) => set("orderNo", e.target.value)}
                placeholder="输入..."
              />
            </div>
            <div>
              <Label>飞书审批编号</Label>
              <Input
                value={values.feishuNo}
                onChange={(e) => set("feishuNo", e.target.value)}
                placeholder="输入..."
              />
            </div>
            <div>
              <Label>付款申请类型</Label>
              <Select
                value={values.applyType}
                onChange={(e) => set("applyType", e.target.value)}
              >
                <option value="">选择...</option>
                {APPLY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>付款金额</Label>
              <Input
                value={values.amount}
                onChange={(e) => set("amount", e.target.value)}
                placeholder="输入..."
                inputMode="decimal"
              />
            </div>
            <div>
              <Label>付款事由</Label>
              <Input
                value={values.purpose}
                onChange={(e) => set("purpose", e.target.value)}
                placeholder="输入..."
              />
            </div>
            <div>
              <Label>收款方式类型</Label>
              <Select
                value={values.paymentMethodType}
                onChange={(e) => set("paymentMethodType", e.target.value)}
              >
                <option value="">选择...</option>
                {PAYMENT_METHOD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PAYMENT_METHOD_TYPE_META[t].label}
                  </option>
                ))}
              </Select>
            </div>
            {extraFields}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 xl:pb-0.5">
            <Button onClick={onSearch}>搜索</Button>
            <Button variant="ghost" onClick={onReset}>
              重置
            </Button>
            <button
              type="button"
              className="inline-flex items-center gap-0.5 text-xs text-ink-3 hover:text-brand-600"
            >
              展开
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
