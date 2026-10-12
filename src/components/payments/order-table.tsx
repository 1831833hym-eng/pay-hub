"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/badge";
import { TablePagination } from "@/components/ui/pagination";
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
  showVoid,
  showSelect,
  onVoid,
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
  /** 初审引导页：待初审单据显示【作废】 */
  showVoid?: boolean;
  showSelect?: boolean;
  onVoid?: (id: string) => void;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize) || 1);
  const safePage = Math.min(page, pageCount);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const pagedRows = useMemo(
    () => rows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rows, safePage, pageSize]
  );
  const allIds = pagedRows.map((r) => r.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const amountTotal = rows.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
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
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款单编号
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              审批单编号
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              审批单名称
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款申请类型
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款事由
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款金额
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款人/户名
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款账户
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款银行
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              币种
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              收款方式类型
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              申请人
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              申请时间
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              付款单状态
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              创建时间
            </th>
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 text-center font-medium">
              更新时间
            </th>
            <th className="sticky right-0 z-20 whitespace-nowrap border-b border-l border-slate-200 bg-[#f5f6f8] px-3 py-2.5 text-center font-medium shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.08)]">
              操作
            </th>
          </tr>
          <tr className="bg-[#eef4ff] text-xs text-brand-700">
            {showSelect ? (
              <th className="sticky left-0 z-20 whitespace-nowrap border-b border-slate-200 bg-[#eef4ff] px-3 py-2 font-medium" />
            ) : null}
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 font-medium">
              合计
            </th>
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-right font-semibold tabular-nums text-ink-1">
              {formatAmount(amountTotal)}
            </th>
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="border-b border-slate-200 px-3 py-2" />
            <th className="sticky right-0 z-20 border-b border-l border-slate-200 bg-[#eef4ff] px-3 py-2 shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.08)]" />
          </tr>
        </thead>
        <tbody>
          {pagedRows.map((item, idx) => {
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
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                  title={item.purpose}
                >
                  {item.purpose}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-right tabular-nums text-ink-1 ${rowBg}`}
                >
                  {formatAmount(item.amount)}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                  title={item.payeeName}
                >
                  {item.payeeName || "—"}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.payeeAccountNo}
                </td>
                <td
                  className={`whitespace-nowrap border-b border-slate-100 px-3 py-2.5 text-ink-2 ${rowBg}`}
                >
                  {item.payeeBank || "—"}
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
                        初审
                      </Link>
                    ) : null}
                    {showVoid && item.status === "pending_submit" ? (
                      <button
                        type="button"
                        onClick={() => onVoid?.(item.id)}
                        className="inline-flex h-7 items-center rounded border border-rose-200 bg-white px-2.5 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        作废
                      </button>
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
                colSpan={showSelect ? 18 : 17}
                className="px-3 py-14 text-center text-ink-4"
              >
                暂无符合条件的付款单
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
    <TablePagination
      className="mt-3"
      total={rows.length}
      page={safePage}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
    />
    </div>
  );
}
