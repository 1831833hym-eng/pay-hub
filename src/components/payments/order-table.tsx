"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import type { PaymentOrder } from "@/lib/payments-data";
import { formatDate, formatMoney } from "@/lib/utils";

export function OrderTable({
  rows,
  selectedIds,
  onToggle,
  onToggleAll,
  viewBase,
  editBase,
  showEdit,
  showSelect,
}: {
  rows: PaymentOrder[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  viewBase: string;
  editBase?: string;
  showEdit?: boolean;
  showSelect?: boolean;
}) {
  const allIds = rows.map((r) => r.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1180px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-[#f5f6f8] text-xs text-ink-2">
            {showSelect ? (
              <th className="px-3 py-2.5 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleAll(allSelected ? [] : allIds)}
                  aria-label="全选"
                />
              </th>
            ) : null}
            <th className="px-3 py-2.5 font-medium">付款单编号</th>
            <th className="px-3 py-2.5 font-medium">飞书审批编号</th>
            <th className="px-3 py-2.5 font-medium">付款申请类型</th>
            <th className="px-3 py-2.5 font-medium">付款事由</th>
            <th className="px-3 py-2.5 font-medium">付款金额</th>
            <th className="px-3 py-2.5 font-medium">币种</th>
            <th className="px-3 py-2.5 font-medium">申请人</th>
            <th className="px-3 py-2.5 font-medium">申请时间</th>
            <th className="px-3 py-2.5 font-medium">付款单状态</th>
            <th className="px-3 py-2.5 font-medium">创建时间</th>
            <th className="px-3 py-2.5 font-medium">更新时间</th>
            <th className="px-3 py-2.5 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, idx) => (
            <tr
              key={item.id}
              className={
                idx % 2 === 1
                  ? "border-b border-slate-100 bg-[#fafbfc]"
                  : "border-b border-slate-100 bg-white"
              }
            >
              {showSelect ? (
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    aria-label={`选择 ${item.orderNo}`}
                  />
                </td>
              ) : null}
              <td className="px-3 py-2.5 font-medium text-ink-1">
                {item.orderNo}
              </td>
              <td className="px-3 py-2.5 text-ink-2">{item.feishuNo}</td>
              <td className="px-3 py-2.5">
                <span className="inline-flex rounded-full bg-[#e8f1ff] px-2 py-0.5 text-xs text-brand-600">
                  {item.applyType}
                </span>
              </td>
              <td
                className="max-w-[180px] truncate px-3 py-2.5 text-ink-2"
                title={item.purpose}
              >
                {item.purpose}
              </td>
              <td className="px-3 py-2.5 text-ink-1">
                {formatMoney(item.amount, item.currency)}
              </td>
              <td className="px-3 py-2.5 text-ink-2">{item.currency}</td>
              <td className="px-3 py-2.5 text-ink-2">{item.applicant}</td>
              <td className="whitespace-nowrap px-3 py-2.5 text-ink-3">
                {formatDate(item.appliedAt)}
              </td>
              <td className="px-3 py-2.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-ink-3">
                {formatDate(item.createdAt)}
              </td>
              <td className="whitespace-nowrap px-3 py-2.5 text-ink-3">
                {formatDate(item.updatedAt)}
              </td>
              <td className="px-3 py-2.5 text-right">
                <div className="flex justify-end gap-3">
                  {showEdit && item.status === "pending_submit" ? (
                    <Link
                      href={`${editBase ?? viewBase}/${item.id}?mode=edit`}
                      className="text-sm text-brand-500 hover:text-brand-600"
                    >
                      编辑
                    </Link>
                  ) : null}
                  <Link
                    href={`${viewBase}/${item.id}`}
                    className="text-sm text-brand-500 hover:text-brand-600"
                  >
                    查看
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={showSelect ? 13 : 12}
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
