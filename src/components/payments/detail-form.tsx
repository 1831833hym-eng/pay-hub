"use client";

import { StatusBadge } from "@/components/ui/badge";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import {
  APPLY_TYPES,
  PAYEE_ACCOUNT_TYPES,
  RECEIVE_METHOD_TYPES,
  STATUS_FLOW,
  type PayeeAccountType,
  type PaymentApplyType,
  type PaymentOrder,
  type ReceiveMethodType,
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
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 付款单编号、飞书审批编号：始终不可修改 */}
        <Field label="付款单编号">
          <Value>{data.orderNo}</Value>
        </Field>
        <Field label="飞书审批编号">
          <Value>{data.feishuNo}</Value>
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
            <Value>{formatMoney(data.amount, data.currency)}</Value>
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
        <Field label="付款单状态">
          <div className="pt-1">
            <StatusBadge status={data.status} />
          </div>
          {editable ? (
            <p className="mt-1 text-[11px] text-ink-4">状态由流程自动更新，不可手工修改</p>
          ) : null}
        </Field>

        <Field label="收款方式类型">
          {editable ? (
            <Select
              value={data.receiveMethodType}
              onChange={(e) =>
                set("receiveMethodType", e.target.value as ReceiveMethodType)
              }
            >
              {RECEIVE_METHOD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{data.receiveMethodType}</Value>
          )}
        </Field>
        <Field label="收款人账户类型">
          {editable ? (
            <Select
              value={data.payeeAccountType}
              onChange={(e) =>
                set("payeeAccountType", e.target.value as PayeeAccountType)
              }
            >
              {PAYEE_ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          ) : (
            <Value>{data.payeeAccountType}</Value>
          )}
        </Field>
        <Field label="收款账号">
          {editable ? (
            <Input
              value={data.payeeAccountNo}
              onChange={(e) => set("payeeAccountNo", e.target.value)}
            />
          ) : (
            <Value>{data.payeeAccountNo}</Value>
          )}
        </Field>
        <Field label="收款银行">
          {editable ? (
            <Input
              value={data.payeeBank}
              onChange={(e) => set("payeeBank", e.target.value)}
            />
          ) : (
            <Value>{data.payeeBank}</Value>
          )}
        </Field>
        <Field label="转账附言" className="sm:col-span-2">
          {editable ? (
            <Input
              value={data.transferMemo}
              onChange={(e) => set("transferMemo", e.target.value)}
              placeholder="默认飞书审批编号"
            />
          ) : (
            <Value>{data.transferMemo || data.feishuNo}</Value>
          )}
          <p className="mt-1 text-[11px] text-ink-4">
            默认取飞书审批编号，可修改
          </p>
        </Field>
      </div>

      <div className="rounded-md border border-slate-200 bg-[#f7f8fa] p-3">
        <div className="mb-2 text-xs font-medium text-ink-2">状态流转</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW.map((step, idx) => {
            const activeIdx = STATUS_FLOW.findIndex(
              (s) => s.key === order.status
            );
            const done =
              order.status === "completed"
                ? true
                : activeIdx >= 0 && idx <= activeIdx;
            return (
              <div
                key={step.key}
                className={`rounded px-2.5 py-1.5 text-xs ${
                  step.key === order.status
                    ? "bg-brand-500 text-white"
                    : done
                      ? "bg-brand-50 text-brand-700"
                      : "bg-white text-ink-4 border border-slate-200"
                }`}
              >
                {step.label}
                {idx < STATUS_FLOW.length - 1 ? " →" : ""}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-ink-4">
          待提交 → 待复核 → 待付款 → 待回单 → 已完成
        </p>
      </div>

      {!editable && order.remark ? (
        <div className="rounded-md border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          备注：{order.remark}
        </div>
      ) : null}

      {!editable && (order.worldfirstTxId || order.receiptNo) ? (
        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          {order.worldfirstTxId ? (
            <div className="rounded-md border border-slate-200 bg-[#f7f8fa] px-3 py-2.5">
              <div className="text-xs text-ink-4">万里汇交易号</div>
              <div className="mt-1 font-medium text-ink-1">
                {order.worldfirstTxId}
              </div>
            </div>
          ) : null}
          {order.receiptNo ? (
            <div className="rounded-md border border-slate-200 bg-[#f7f8fa] px-3 py-2.5">
              <div className="text-xs text-ink-4">万里汇回单号</div>
              <div className="mt-1 font-medium text-ink-1">{order.receiptNo}</div>
            </div>
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
    <div
      className={`rounded-md border border-slate-200 bg-[#f7f8fa] px-2.5 py-1.5 text-sm text-ink-1 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
