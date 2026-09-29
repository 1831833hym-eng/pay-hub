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
import { StatusBadge } from "@/components/ui/badge";
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

  const canApprove = payment.status === "pending_review";
  const canRetry = payment.status === "failed" || payment.status === "rejected";

  return (
    <AppShell
      title={`付款详情 · ${payment.orderNo}`}
      description={`${payment.merchantName} 向 ${payment.beneficiaryName} 付款 · ${payment.purpose}`}
      actions={
        <>
          <Link href="/payments">
            <Button variant="secondary">返回列表</Button>
          </Link>
          {canApprove ? (
            <>
              <Button variant="outline">驳回</Button>
              <Button>审核通过</Button>
            </>
          ) : null}
          {canRetry ? <Button>修正后重试</Button> : null}
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
        <Metric label="付款通道" value={payment.channel} />
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
            <CardTitle>基本信息</CardTitle>
            <CardDescription>付款单核心字段与账户信息</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <Info label="付款单号" value={payment.orderNo} />
              <Info label="申请人" value={payment.applicant} />
              <Info label="商户主体" value={payment.merchantName} />
              <Info label="付款账户" value={payment.payerAccount} />
              <Info label="收款方" value={payment.beneficiaryName} />
              <Info label="付款用途" value={payment.purpose} />
              <Info label="创建时间" value={formatDate(payment.createdAt)} />
              <Info
                label="备注"
                value={payment.remark || "—"}
                className="sm:col-span-2"
              />
            </dl>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>流程轨迹</CardTitle>
            <CardDescription>审核与出款节点留痕</CardDescription>
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

      {canApprove ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>审核操作（原型）</CardTitle>
            <CardDescription>
              实际系统中将写入审批意见并触发下一节点通知
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>通过并推送出款</Button>
            <Button variant="outline">转风控复核</Button>
            <Button variant="danger">驳回并退回申请人</Button>
          </CardContent>
        </Card>
      ) : null}
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-card">
      <div className="text-xs text-ink-4">{label}</div>
      <div className="mt-2 font-display text-xl font-bold text-brand-600">
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
      <dd className="mt-1 text-sm font-medium text-ink-1">{value}</dd>
    </div>
  );
}
