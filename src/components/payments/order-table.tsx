"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
      <table className="w-full min-w-[1200px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-ink-4">
            {showSelect ? (
              <th className="pb-3 pr-2 font-medium">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() =>
                    onToggleAll(allSelected ? [] : allIds)
                  }
                  aria-label="全选"
                />
              </th>
            ) : null}
            <th className="pb-3 font-medium">付款单编号</th>
            <th className="pb-3 font-medium">飞书审批编号</th>
            <th className="pb-3 font-medium">付款申请类型</th>
            <th className="pb-3 font-medium">付款事由</th>
            <th className="pb-3 font-medium">付款金额</th>
            <th className="pb-3 font-medium">币种</th>
            <th className="pb-3 font-medium">申请人</th>
            <th className="pb-3 font-medium">申请时间</th>
            <th className="pb-3 font-medium">付款单状态</th>
            <th className="pb-3 font-medium">创建时间</th>
            <th className="pb-3 font-medium">更新时间</th>
            <th className="pb-3 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-b border-slate-50 last:border-0">
              {showSelect ? (
                <td className="py-3.5 pr-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggle(item.id)}
                    aria-label={`选择 ${item.orderNo}`}
                  />
                </td>
              ) : null}
              <td className="py-3.5 font-medium text-ink-1">{item.orderNo}</td>
              <td className="py-3.5 text-ink-2">{item.feishuNo}</td>
              <td className="py-3.5 text-ink-2">{item.applyType}</td>
              <td className="max-w-[200px] truncate py-3.5 text-ink-2" title={item.purpose}>
                {item.purpose}
              </td>
              <td className="py-3.5 font-semibold text-brand-600">
                {formatMoney(item.amount, item.currency)}
              </td>
              <td className="py-3.5 text-ink-2">{item.currency}</td>
              <td className="py-3.5 text-ink-2">{item.applicant}</td>
              <td className="py-3.5 whitespace-nowrap text-ink-3">
                {formatDate(item.appliedAt)}
              </td>
              <td className="py-3.5">
                <StatusBadge status={item.status} />
              </td>
              <td className="py-3.5 whitespace-nowrap text-ink-3">
                {formatDate(item.createdAt)}
              </td>
              <td className="py-3.5 whitespace-nowrap text-ink-3">
                {formatDate(item.updatedAt)}
              </td>
              <td className="py-3.5 text-right">
                <div className="flex justify-end gap-2">
                  {showEdit && item.status === "pending_submit" ? (
                    <Link href={`${editBase ?? viewBase}/${item.id}?mode=edit`}>
                      <Button variant="outline" size="sm">
                        编辑
                      </Button>
                    </Link>
                  ) : null}
                  <Link href={`${viewBase}/${item.id}`}>
                    <Button variant="secondary" size="sm">
                      查看
                    </Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={showSelect ? 13 : 12}
                className="py-16 text-center text-ink-4"
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
