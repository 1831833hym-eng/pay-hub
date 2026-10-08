import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge, Pill } from "@/components/ui/badge";
import { getPaymentById } from "@/lib/payments-data";
import { formatDate, formatMoney } from "@/lib/utils";

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const payment = getPaymentById(id);
  if (!payment) notFound();

  const canReview = payment.status === "pending_review";
  const canPay = payment.status === "ready_to_pay";
  const canReceipt =
    payment.status === "paid" || payment.status === "paying";

  const detailFields: { label: string; value: React.ReactNode }[] = [
    { label: "付款单编号", value: payment.orderNo },
    { label: "飞书审批编号", value: payment.feishuInstanceCode },
    { label: "付款申请类型", value: payment.applicationType },
    { label: "付款事由", value: payment.purpose },
    {
      label: "付款金额",
      value: (
        <span className="font-semibold text-brand-600">
          {payment.amount.toLocaleString("zh-CN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },
    { label: "币种", value: payment.currency },
    { label: "申请人", value: payment.applicant },
    { label: "申请时间", value: formatDate(payment.appliedAt) },
    {
      label: "付款单状态",
      value: <StatusBadge status={payment.status} />,
    },
  ];

  return (
    <AppShell
      title="付款单明细"
      description="查看由飞书审批生成的付款单核心信息；复核通过后经万里汇出款，回单回传飞书。"
      actions={
        <>
          <Link href="/">
            <Button variant="secondary">返回列表</Button>
          </Link>
          {canReview ? (
            <Link href="/review">
              <Button>去复核</Button>
            </Link>
          ) : null}
          {canPay ? (
            <Link href="/worldfirst">
              <Button>提交万里汇</Button>
            </Link>
          ) : null}
          {canReceipt ? (
            <Link href="/receipts">
              <Button>处理回单</Button>
            </Link>
          ) : null}
        </>
      }
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>
            由飞书审批字段映射生成，用于复核与万里汇出款核对
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {detailFields.map((field) => (
              <div key={field.label}>
                <dt className="text-xs text-ink-4">{field.label}</dt>
                <dd className="mt-1.5 text-sm font-medium text-ink-1">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>出款与回单（扩展信息）</CardTitle>
            <CardDescription>
              支撑飞书 → 复核 → 万里汇 → 回单回传闭环
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2 text-sm">
              <Info label="收款方" value={payment.payeeName} />
              <Info
                label="收款账户"
                value={`${payment.payeeBank} ${payment.payeeAccountMasked}`}
              />
              <Info
                label="折合人民币"
                value={formatMoney(payment.cnyEquivalent, "CNY")}
              />
              <Info
                label="万里汇交易号"
                value={payment.worldfirstTxId ?? "—"}
              />
              <Info
                label="万里汇状态"
                value={payment.worldfirstStatus ?? "—"}
              />
              <Info label="回单号" value={payment.receiptNo ?? "—"} />
              <Info label="创建时间" value={formatDate(payment.createdAt)} />
              <Info label="更新时间" value={formatDate(payment.updatedAt)} />
              {payment.reviewer ? (
                <Info label="复核人" value={payment.reviewer} />
              ) : null}
              {payment.reviewComment ? (
                <Info
                  label="复核意见"
                  value={payment.reviewComment}
                  className="sm:col-span-2"
                />
              ) : null}
            </dl>
            {payment.receiptSyncedAt ? (
              <div className="mt-4">
                <Pill>
                  回单已于 {formatDate(payment.receiptSyncedAt)} 回传飞书
                </Pill>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>流程轨迹</CardTitle>
            <CardDescription>
              飞书审批 → 付款单 → 复核 → 万里汇 → 回单回传
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-5 border-l border-brand-100 pl-5">
              {payment.timeline.map((node, idx) => (
                <li key={`${node.time}-${idx}`} className="relative">
                  <span className="absolute -left-[1.6rem] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-brand-500 shadow" />
                  <div className="text-sm font-medium text-ink-1">
                    {node.title}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-4">
                    {node.time} · {node.actor}
                  </div>
                  <p className="mt-1 text-sm text-ink-3">{node.desc}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Info({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs text-ink-4">{label}</dt>
      <dd className="mt-1 break-all text-sm font-medium text-ink-1">{value}</dd>
    </div>
  );
}
