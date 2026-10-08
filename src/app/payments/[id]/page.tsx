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

  return (
    <AppShell
      title={`付款详情 · ${payment.orderNo}`}
      description={`飞书审批 ${payment.feishuInstanceCode} · ${payment.purpose}`}
      actions={
        <>
          <Link href="/payments">
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
          {payment.status === "receipt_synced" ? (
            <Link href="/feishu">
              <Button variant="outline">查看飞书承接</Button>
            </Link>
          ) : null}
        </>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="付款金额"
          value={formatMoney(payment.amount, payment.currency)}
        />
        <Metric
          label="折合人民币"
          value={formatMoney(payment.cnyEquivalent, "CNY")}
        />
        <Metric
          label="万里汇交易号"
          value={payment.worldfirstTxId ?? "尚未提交"}
        />
        <div className="rounded-2xl bg-white px-5 py-4 shadow-card">
          <div className="text-xs text-ink-4">当前状态</div>
          <div className="mt-2">
            <StatusBadge status={payment.status} />
          </div>
          <div className="mt-2 text-xs text-ink-4">
            更新于 {formatDate(payment.updatedAt)}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>付款与审批信息</CardTitle>
            <CardDescription>
              字段来源于飞书审批，复核后提交万里汇出款
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Info label="付款单号" value={payment.orderNo} />
              <Info label="申请人" value={payment.applicant} />
              <Info label="商户主体" value={payment.merchantName} />
              <Info label="飞书实例号" value={payment.feishuInstanceCode} />
              <Info label="收款方" value={payment.payeeName} />
              <Info
                label="收款账户"
                value={`${payment.payeeBank} ${payment.payeeAccountMasked}`}
              />
              <Info label="付款用途" value={payment.purpose} />
              <Info label="创建时间" value={formatDate(payment.createdAt)} />
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
              {payment.receiptNo ? (
                <Info label="万里汇回单号" value={payment.receiptNo} />
              ) : null}
              {payment.receiptSyncedAt ? (
                <Info
                  label="回传飞书时间"
                  value={formatDate(payment.receiptSyncedAt)}
                />
              ) : null}
            </dl>
            {payment.worldfirstStatus ? (
              <div className="mt-4">
                <Pill>万里汇状态 · {payment.worldfirstStatus}</Pill>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>流程轨迹</CardTitle>
            <CardDescription>
              飞书 → 付款单 → 复核 → 万里汇 → 回单回传
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-card">
      <div className="text-xs text-ink-4">{label}</div>
      <div className="mt-2 break-all font-display text-lg font-bold text-brand-600 sm:text-xl">
        {value}
      </div>
    </div>
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
