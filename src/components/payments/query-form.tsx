"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import { APPLY_TYPES } from "@/lib/payments-data";

export type QueryValues = {
  orderNo: string;
  feishuNo: string;
  applyType: string;
  purpose: string;
  amount: string;
};

export const EMPTY_QUERY: QueryValues = {
  orderNo: "",
  feishuNo: "",
  applyType: "",
  purpose: "",
  amount: "",
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
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">查询条件</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div>
            <Label>付款单编号</Label>
            <Input
              value={values.orderNo}
              onChange={(e) => set("orderNo", e.target.value)}
              placeholder="请输入付款单编号"
            />
          </div>
          <div>
            <Label>飞书审批编号</Label>
            <Input
              value={values.feishuNo}
              onChange={(e) => set("feishuNo", e.target.value)}
              placeholder="请输入飞书审批编号"
            />
          </div>
          <div>
            <Label>付款申请类型</Label>
            <Select
              value={values.applyType}
              onChange={(e) => set("applyType", e.target.value)}
            >
              <option value="">全部类型</option>
              {APPLY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>付款事由</Label>
            <Input
              value={values.purpose}
              onChange={(e) => set("purpose", e.target.value)}
              placeholder="请输入付款事由"
            />
          </div>
          <div>
            <Label>付款金额</Label>
            <Input
              value={values.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="请输入付款金额"
              inputMode="decimal"
            />
          </div>
          {extraFields}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={onSearch}>搜索</Button>
          <Button variant="secondary" onClick={onReset}>
            重置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
