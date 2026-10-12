"use client";

import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  APPLY_TYPES,
  PAYMENT_METHOD_TYPES,
  PAYMENT_METHOD_TYPE_META,
  paymentMethodTypeLabel,
  type PaymentApplyType,
  type PaymentOrder,
  type PaymentMethodType,
} from "@/lib/payments-data";
import { cn, formatAmount, formatDate } from "@/lib/utils";

export function DetailForm({
  order,
  editable,
  memoEditable = false,
  draft,
  onChange,
}: {
  order: PaymentOrder;
  editable: boolean;
  /** 仅初审编辑态开放转账附言 */
  memoEditable?: boolean;
  draft?: PaymentOrder;
  onChange?: (next: PaymentOrder) => void;
}) {
  const data = draft ?? order;

  const set = <K extends keyof PaymentOrder>(key: K, value: PaymentOrder[K]) => {
    if (!onChange) return;
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 付款单编号、审批单编号、审批单名称：始终不可修改 */}
        <Field label="付款单编号">
          <Value>{data.orderNo}</Value>
        </Field>
        <Field label="审批单编号">
          <Value>{data.feishuNo}</Value>
        </Field>
        <Field label="审批单名称">
          <Value>{data.approvalFlowName}</Value>
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
        <Field label="付款单状态">
          <div className="flex h-8 items-center">
            <StatusBadge status={data.status} />
          </div>
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
        <Field label="费用具体明细" className="sm:col-span-2 lg:col-span-3">
          {editable ? (
            <Textarea
              value={data.expenseDetail}
              onChange={(e) => set("expenseDetail", e.target.value)}
            />
          ) : (
            <Value>{data.expenseDetail}</Value>
          )}
        </Field>
        <Field label="转账附言" className="sm:col-span-2 lg:col-span-3">
          {editable || memoEditable ? (
            <Input
              value={data.transferMemo}
              onChange={(e) => set("transferMemo", e.target.value)}
              aria-label="转账附言"
            />
          ) : (
            <Value>{data.transferMemo || data.feishuNo}</Value>
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
            <Value>{formatAmount(data.amount)}</Value>
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
        <Field label="收款方式类型">
          {editable ? (
            <Select
              value={data.paymentMethodType}
              onChange={(e) =>
                set("paymentMethodType", e.target.value as PaymentMethodType)
              }
            >
              {PAYMENT_METHOD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PAYMENT_METHOD_TYPE_META[t].label}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{paymentMethodTypeLabel(data.paymentMethodType)}</Value>
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
          {editable ? (
            <Input
              type="datetime-local"
              value={toLocalInputValue(data.appliedAt)}
              onChange={(e) =>
                set("appliedAt", fromLocalInputValue(e.target.value))
              }
            />
          ) : (
            <Value>{formatDate(data.appliedAt)}</Value>
          )}
        </Field>
        {data.paymentChannel ? (
          <Field label="付款渠道">
            <Value>{data.paymentChannel}</Value>
          </Field>
        ) : null}
      </div>

      {!editable && (order.worldfirstTxId || order.receiptNo) ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {order.worldfirstTxId ? (
            <Field label="万里汇交易号">
              <Value>{order.worldfirstTxId}</Value>
            </Field>
          ) : null}
          {order.receiptNo ? (
            <Field label="万里汇回单号">
              <Value>{order.receiptNo}</Value>
            </Field>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function toLocalInputValue(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInputValue(local: string) {
  const d = new Date(local);
  return Number.isNaN(d.getTime()) ? local : d.toISOString();
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
    <div className={cn("min-h-8 text-sm leading-6 text-ink-1", className)}>
      {children || "—"}
    </div>
  );
}
