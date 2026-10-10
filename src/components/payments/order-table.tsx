"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import {
  paymentMethodTypeLabel,
  type PaymentOrder,
} from "@/lib/payments-data";
import { formatAmount, formatDate } from "@/lib/utils";

export function OrderTable({
  rows,
  selectedIds,
  onToggle,
  onToggleAll,
  viewBase,
  editBase,
  showEdit,
  showReview,
  showSelect,
}: {
  rows: PaymentOrder[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  viewBase: string;
  editBase?: string;
  showEdit?: boolean;
  /** 复核引导页：待复核单据显示【复核】入口 */
  showReview?: boolean;
  showSelect?: boolean;
}) {
  const allIds = rows.map((r) => r.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="bg-[#f5f6f8] text-xs text-ink-2">
            {showSelect ? (
              <th className="sticky left-0 z-20 whitespace-nowrap border-b border-slate-200 bg-[#f5f6f8] px-3 py-2.5 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleAll(allSelected ? [] : allIds)}
                  aria-label="全选"
                />
              </th>
            ) : null}
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              付款单编号
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              审批单编号
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              审批单名称
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              付款申请类型
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              付款金额
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              付款事由
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              币种
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              收款方式类型
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              申请人
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              申请时间
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              付款单状态
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              创建时间
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-medium">
              更新时间
            </th>
            <th className="sticky right-0 z-20 whitespace-nowrap border-b border-l border-slate-200 bg-[#f5f6f8] px-3 py-2.5 text-right font-medium shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.08)]">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, idx) => {
            const rowBg = idx % 2 === 1 ? "bg-[#fafbfc]" : "bg-white";
            return (
              <tr key={item.id}>
                {showSelect ? (
                  <td
                    className={`sticky left-0 z-10 whitespace-nowrap border-b border-slate-100 px-3 py-2.5 ${rowBg}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggle(item.id)}
                      aria-label={`选择 ${item.orderNo}`}
                    />
                  </td>
                ) : null}
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 font-medium text-ink-1 ${rowBg}`}
                >
                  {item.orderNo}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.feishuNo}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                  title={item.approvalFlowName}
                >
                  {item.approvalFlowName}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 ${rowBg}`}
                >
                  <span className="inline-flex rounded-full bg-[#e8f1ff] px-2 py-0.5 text-xs text-brand-600">
                    {item.applyType}
                  </span>
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-1 ${rowBg}`}
                >
                  {formatAmount(item.amount)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                  title={item.purpose}
                >
                  {item.purpose}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.currency}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {paymentMethodTypeLabel(item.paymentMethodType)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.applicant}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-3 ${rowBg}`}
                >
                  {formatDate(item.appliedAt)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 ${rowBg}`}
                >
                  <StatusBadge status={item.status} />
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-3 ${rowBg}`}
                >
                  {formatDate(item.createdAt)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-3 ${rowBg}`}
                >
                  {formatDate(item.updatedAt)}
                </td>
                <td
                  className={`sticky right-0 z-10 whitespace-nowrap border-b border-l border-slate-100 px-3 py-2.5 text-right shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.08)] ${rowBg}`}
                >
                  <div className="flex flex-nowrap items-center justify-end gap-2">
                    {showEdit && item.status === "pending_submit" ? (
                      <Link
                        href={`${editBase ?? viewBase}/${item.id}?mode=edit`}
                        className="inline-flex h-7 items-center rounded border border-slate-200 bg-white px-2.5 text-xs text-ink-2 hover:border-brand-200 hover:text-brand-600"
                      >
                        编辑
                      </Link>
                    ) : null}
                    {showReview && item.status === "pending_review" ? (
                      <Link
                        href={`${viewBase}/${item.id}?mode=review`}
                        className="inline-flex h-7 items-center rounded border border-brand-200 bg-white px-2.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
                      >
                        复核
                      </Link>
                    ) : null}
                    <Link
                      href={`${viewBase}/${item.id}`}
                      className="inline-flex h-7 items-center rounded bg-brand-500 px-2.5 text-xs font-medium text-white hover:bg-brand-600"
                    >
                      查看
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={showSelect ? 15 : 14}
                className="px-3 py-14 text-center text-ink-4"
              >
                暂无符合条件的付款单
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
