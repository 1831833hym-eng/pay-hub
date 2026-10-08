"use client";

import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  APPLY_TYPES,
  STATUS_FLOW,
  type PaymentApplyType,
  type PaymentOrder,
} from "@/lib/payments-data";
import { formatDate, formatMoney } from "@/lib/utils";

export function DetailForm({
  order,
  editable,
  draft,
  onChange,
}: {
  order: PaymentOrder;
  editable: boolean;
  draft?: PaymentOrder;
  onChange?: (next: PaymentOrder) => void;
}) {
  const data = draft ?? order;

  const set = <K extends keyof PaymentOrder>(key: K, value: PaymentOrder[K]) => {
    if (!onChange) return;
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="付款单编号">
          {editable ? (
            <Input value={data.orderNo} disabled />
          ) : (
            <Value>{data.orderNo}</Value>
          )}
        </Field>
        <Field label="飞书审批编号">
          {editable ? (
            <Input
              value={data.feishuNo}
              onChange={(e) => set("feishuNo", e.target.value)}
            />
          ) : (
            <Value>{data.feishuNo}</Value>
          )}
        </Field>
        <Field label="付款申请类型">
          {editable ? (
            <Select
              value={data.applyType}
              onChange={(e) =>
                set("applyType", e.target.value as PaymentApplyType)
              }
            >
              {APPLY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{data.applyType}</Value>
          )}
        </Field>
        <Field label="付款事由" className="sm:col-span-2 lg:col-span-3">
          {editable ? (
            <Textarea
              value={data.purpose}
              onChange={(e) => set("purpose", e.target.value)}
            />
          ) : (
            <Value>{data.purpose}</Value>
          )}
        </Field>
        <Field label="付款金额">
          {editable ? (
            <Input
              value={String(data.amount)}
              onChange={(e) => set("amount", Number(e.target.value) || 0)}
              inputMode="decimal"
            />
          ) : (
            <Value className="font-semibold text-brand-600">
              {formatMoney(data.amount, data.currency)}
            </Value>
          )}
        </Field>
        <Field label="币种">
          {editable ? (
            <Select
              value={data.currency}
              onChange={(e) =>
                set("currency", e.target.value as PaymentOrder["currency"])
              }
            >
              {["USD", "EUR", "HKD", "SGD", "JPY", "GBP", "CNY"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{data.currency}</Value>
          )}
        </Field>
        <Field label="申请人">
          {editable ? (
            <Input
              value={data.applicant}
              onChange={(e) => set("applicant", e.target.value)}
            />
          ) : (
            <Value>{data.applicant}</Value>
          )}
        </Field>
        <Field label="申请时间">
          <Value>{formatDate(data.appliedAt)}</Value>
        </Field>
        <Field label="付款单状态">
          <div className="pt-1">
            <StatusBadge status={data.status} />
          </div>
        </Field>
      </div>

      <div className="rounded-xl border border-slate-100 bg-surface-soft p-4">
        <div className="mb-3 text-sm font-medium text-ink-1">状态流转</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW.map((step, idx) => {
            const activeIdx = STATUS_FLOW.findIndex((s) => s.key === order.status);
            const done =
              order.status === "completed"
                ? true
                : activeIdx >= 0 && idx <= activeIdx;
            return (
              <div
                key={step.key}
                className={`rounded-lg px-3 py-2 text-xs ${
                  step.key === order.status
                    ? "bg-brand-500 text-white"
                    : done
                      ? "bg-brand-50 text-brand-700"
                      : "bg-white text-ink-4"
                }`}
              >
                {step.label}
                {idx < STATUS_FLOW.length - 1 ? " →" : ""}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-4">
          提交后：待提交 → 待复核；复核通过 → 待付款；万里汇付款成功 → 待回单；获取回单并回传飞书 → 已完成。
        </p>
      </div>

      {!editable && order.remark ? (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          备注：{order.remark}
        </div>
      ) : null}

      {!editable && (order.worldfirstTxId || order.receiptNo) ? (
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          {order.worldfirstTxId ? (
            <div className="rounded-xl bg-surface-soft px-3 py-3">
              <div className="text-xs text-ink-4">万里汇交易号</div>
              <div className="mt-1 font-medium text-ink-1">
                {order.worldfirstTxId}
              </div>
            </div>
          ) : null}
          {order.receiptNo ? (
            <div className="rounded-xl bg-surface-soft px-3 py-3">
              <div className="text-xs text-ink-4">万里汇回单号</div>
              <div className="mt-1 font-medium text-ink-1">{order.receiptNo}</div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Value({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-100 bg-surface-soft px-3 py-2.5 text-sm text-ink-1 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
