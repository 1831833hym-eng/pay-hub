"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, FileUp } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { beneficiaries } from "@/lib/payments-data";

export default function CreatePaymentPage() {
  const searchParams = useSearchParams();
  const isBatch = searchParams.get("mode") === "batch";

  const [beneficiaryId, setBeneficiaryId] = useState(beneficiaries[0].id);
  const [amount, setAmount] = useState("12850");
  const [submitted, setSubmitted] = useState(false);
  const [purpose, setPurpose] = useState("FBA仓储与尾程费用");

  const selected = useMemo(
    () => beneficiaries.find((b) => b.id === beneficiaryId) ?? beneficiaries[0],
    [beneficiaryId]
  );

  if (submitted) {
    return (
      <AppShell
        title="付款申请已提交"
        description="系统已生成付款单并进入审核流程。"
      >
        <Card className="mx-auto max-w-xl text-center">
          <CardContent className="space-y-4 py-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-ink-1">提交成功</h2>
            <p className="text-sm text-ink-3">
              付款单号{" "}
              <span className="font-medium text-brand-600">PAY20260328099</span>{" "}
              已进入待审核队列，财务与风控将按优先级处理。
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Link href="/payments/pay-1001">
                <Button>查看示例详情</Button>
              </Link>
              <Link href="/payments">
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
      title={isBatch ? "批量付款导入" : "发起单笔付款"}
      description={
        isBatch
          ? "按标准模板上传付款明细，系统自动校验收款方、额度与币种后生成付款单。"
          : "填写付款账户、收款方、金额与用途，提交后进入审核与出款流程。"
      }
      actions={
        <Link href="/payments">
          <Button variant="secondary">返回列表</Button>
        </Link>
      }
    >
      {isBatch ? (
        <Card>
          <CardHeader>
            <CardTitle>上传付款文件</CardTitle>
            <CardDescription>
              支持 .xlsx / .csv，单次最多 500 行。请先下载模板核对字段。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-14 text-center">
              <FileUp className="mb-3 h-10 w-10 text-brand-500" />
              <p className="text-sm font-medium text-ink-1">
                拖拽文件到此处，或点击选择文件
              </p>
              <p className="mt-1 text-xs text-ink-4">
                原型示意：点击下方按钮模拟导入成功
              </p>
              <Button className="mt-5" onClick={() => setSubmitted(true)}>
                模拟导入并提交审核
              </Button>
            </div>
            <div className="rounded-xl bg-surface-soft px-4 py-3 text-sm text-ink-3">
              模板字段：商户编码、付款账户、收款方
              ID、币种、金额、付款用途、合同编号、期望出款日
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>付款信息</CardTitle>
              <CardDescription>带 * 为必填项</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>商户主体 *</Label>
                <Select defaultValue="星辰跨境旗舰店">
                  <option>星辰跨境旗舰店</option>
                  <option>蓝海数贸</option>
                  <option>北极光品牌</option>
                  <option>云帆出海</option>
                </Select>
              </div>
              <div>
                <Label>付款账户 *</Label>
                <Select defaultValue="USD结算户 ****6612">
                  <option>USD结算户 ****6612 · 可用 $82,410</option>
                  <option>EUR结算户 ****2281 · 可用 €41,220</option>
                  <option>HKD结算户 ****1188 · 可用 HK$960,000</option>
                  <option>SGD结算户 ****4409 · 可用 S$55,300</option>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>收款方 *</Label>
                <Select
                  value={beneficiaryId}
                  onChange={(e) => setBeneficiaryId(e.target.value)}
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} · {b.country} · {b.currency}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label>币种</Label>
                <Input value={selected.currency} readOnly />
              </div>
              <div>
                <Label>付款金额 *</Label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div className="sm:col-span-2">
                <Label>付款用途 *</Label>
                <Input
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <div>
                <Label>期望出款日</Label>
                <Input type="date" defaultValue="2026-03-29" />
              </div>
              <div>
                <Label>付款通道</Label>
                <Select defaultValue="auto">
                  <option value="auto">智能推荐（SWIFT）</option>
                  <option value="sepa">SEPA 本地清算</option>
                  <option value="fps">香港 FPS</option>
                  <option value="local">本地钱包通道</option>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>备注 / 附件说明</Label>
                <Textarea placeholder="可填写合同编号、发票号或补充说明" />
              </div>
              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <Button onClick={() => setSubmitted(true)}>提交审核</Button>
                <Button variant="secondary">保存草稿</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>收款方摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="名称" value={selected.name} />
                <Row label="国家/地区" value={selected.country} />
                <Row label="银行" value={selected.bankName} />
                <Row label="账号" value={selected.accountMasked} />
                <Row label="类型" value={selected.type} />
                <Row label="认证状态" value={selected.status} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>费用预估</CardTitle>
                <CardDescription>按当前通道规则试算</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row
                  label="付款金额"
                  value={`${amount || "0"} ${selected.currency}`}
                />
                <Row label="通道手续费" value={`12.00 ${selected.currency}`} />
                <Row
                  label="中间行费（预估）"
                  value={`15.00 ${selected.currency}`}
                />
                <div className="border-t border-slate-100 pt-2">
                  <Row
                    label="预计扣款"
                    value={`${(Number(amount || 0) + 27).toFixed(2)} ${selected.currency}`}
                    strong
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-ink-4">{label}</span>
      <span
        className={
          strong
            ? "text-right font-semibold text-brand-600"
            : "text-right text-ink-1"
        }
      >
        {value}
      </span>
    </div>
  );
}
