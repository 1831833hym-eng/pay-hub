import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  RefreshCw,
  Send,
  Upload,
} from "lucide-react";
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
import {
  flowSteps,
  overviewStats,
  payments,
} from "@/lib/payments-data";
import { formatMoney } from "@/lib/utils";

const moduleCards = [
  {
    title: "飞书审批承接",
    desc: "拉取飞书付款审批通过单据，映射金额、收款方与用途等字段。",
    href: "/feishu",
    icon: FileText,
  },
  {
    title: "付款单 / 复核",
    desc: "由审批信息生成付款单，财务复核通过后方可出款。",
    href: "/review",
    icon: ClipboardCheck,
  },
  {
    title: "万里汇出款",
    desc: "复核通过后调用万里汇付款接口，跟踪出款状态。",
    href: "/worldfirst",
    icon: Send,
  },
  {
    title: "回单回传飞书",
    desc: "获取万里汇回单并上传至原飞书审批流，完成闭环。",
    href: "/receipts",
    icon: Upload,
  },
];

export default function PaymentCenterPage() {
  const recent = payments.slice(0, 5);

  return (
    <AppShell
      title="付款中心"
      description="承接飞书审批付款申请 → 生成付款单 → 复核通过 → 调用万里汇付款 → 获取回单并回传飞书审批流。"
      actions={
        <>
          <Link href="/feishu">
            <Button variant="secondary">
              <RefreshCw className="h-4 w-4" />
              同步飞书审批
            </Button>
          </Link>
          <Link href="/review">
            <Button>
              <ClipboardCheck className="h-4 w-4" />
              去复核
            </Button>
          </Link>
        </>
      }
    >
      <section className="mb-8 px-2 py-6 text-center text-white sm:py-10">
        <h2 className="font-display text-3xl font-bold tracking-tight drop-shadow-sm sm:text-5xl">
          付款中心管理系统
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          打通飞书审批与万里汇出款，实现付款申请、复核、出款与回单回传一体化
        </p>
      </section>

      <section className="mb-6 rounded-2xl bg-white px-4 py-6 shadow-card sm:px-8 sm:py-7">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:divide-x lg:divide-slate-100">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="px-2 text-center lg:px-4">
              <div className="font-display text-3xl font-bold text-brand-500 sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-ink-2">{stat.label}</div>
              <div className="mt-1 text-xs text-ink-4">{stat.hint}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 overflow-hidden rounded-2xl bg-white px-4 py-5 shadow-card sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink-1">端到端付款链路</h3>
            <p className="mt-1 text-sm text-ink-3">
              飞书审批 → 付款单 → 复核 → 万里汇 → 回单回传
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {flowSteps.map((item, idx) => (
            <div
              key={item.step}
              className="relative rounded-xl border border-slate-100 bg-surface-soft p-3"
            >
              <div className="mb-2 font-display text-xs font-bold text-brand-500">
                {item.step}
              </div>
              <div className="text-sm font-medium text-ink-1">{item.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-ink-3">
                {item.desc}
              </p>
              {idx < flowSteps.length - 1 ? (
                <ArrowRight className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-brand-300 md:block" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {moduleCards.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link key={mod.title} href={mod.href} className="group">
              <Card className="h-full transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                <CardHeader>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="flex items-center gap-1 text-[15px] group-hover:text-brand-600">
                    {mod.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {mod.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-500">
                    进入模块
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>最近付款单</CardTitle>
              <CardDescription>来自飞书审批，跟踪复核与万里汇出款</CardDescription>
            </div>
            <Link href="/payments">
              <Button variant="outline" size="sm">
                全部
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/payments/${item.id}`}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-surface-soft px-4 py-3 transition hover:border-brand-100 hover:bg-brand-50/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink-1">{item.orderNo}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-ink-3">
                    飞书 {item.feishuInstanceCode.slice(-12)} · {item.payeeName}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-semibold text-brand-600">
                    {formatMoney(item.amount, item.currency)}
                  </div>
                  <div className="text-xs text-ink-4">
                    {item.worldfirstTxId
                      ? `万里汇 ${item.worldfirstTxId.slice(-8)}`
                      : "尚未提交万里汇"}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>闭环说明</CardTitle>
            <CardDescription>与飞书、万里汇的系统协同</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-3">
            <div className="rounded-xl bg-surface-soft px-3 py-3">
              <div className="font-medium text-ink-1">入站：飞书审批</div>
              <p className="mt-1 text-xs leading-relaxed">
                审批通过后推送/拉取付款申请字段，自动生成付款单草稿或待复核单。
              </p>
            </div>
            <div className="rounded-xl bg-surface-soft px-3 py-3">
              <div className="font-medium text-ink-1">出款：万里汇接口</div>
              <p className="mt-1 text-xs leading-relaxed">
                复核通过后调用万里汇付款 API，异步查询出款结果。
              </p>
            </div>
            <div className="rounded-xl bg-surface-soft px-3 py-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <div>
                  <div className="font-medium text-ink-1">回传：飞书附件</div>
                  <p className="mt-1 text-xs leading-relaxed">
                    付款成功后下载万里汇回单，上传至原审批实例，关闭业务闭环。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
