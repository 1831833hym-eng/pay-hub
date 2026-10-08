import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  ListOrdered,
  Send,
  ShieldAlert,
  Upload,
  Users,
  Wallet,
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
import { overviewStats, payments, quickActions } from "@/lib/payments-data";
import { formatMoney } from "@/lib/utils";

const iconMap = {
  send: Send,
  upload: Upload,
  users: Users,
  list: ListOrdered,
} as const;

const moduleCards = [
  {
    title: "发起付款",
    desc: "单笔或批量提交跨境付款申请，自动校验账户额度与收款方认证状态。",
    href: "/payments/create",
    icon: Send,
  },
  {
    title: "付款审核",
    desc: "财务与风控双节点审核，大额与高风险国家付款优先排队处理。",
    href: "/payments",
    icon: ShieldAlert,
  },
  {
    title: "出款追踪",
    desc: "按通道查看付款中与失败单据，支持修正账号后一键重推出款。",
    href: "/payments",
    icon: BarChart3,
  },
  {
    title: "收款方管理",
    desc: "维护供应商、物流商与服务商海外账户，完成 KYC 后可出款。",
    href: "/beneficiaries",
    icon: Building2,
  },
];

const channelStats = [
  { name: "SWIFT 合作通道", success: "98.2%", latency: "T+1~T+2", load: "高" },
  { name: "SEPA 本地清算", success: "99.1%", latency: "当日", load: "中" },
  { name: "香港 FPS", success: "99.6%", latency: "准实时", load: "中" },
  { name: "本地钱包通道", success: "97.4%", latency: "分钟级", load: "低" },
];

export default function PaymentCenterPage() {
  const recent = payments.slice(0, 5);

  return (
    <AppShell
      title="付款中心"
      description="付款中心统一管理跨境电商资金出款：发起申请、合规审核、通道出款与失败重试，覆盖多币种结算账户与海外收款方。"
      actions={
        <>
          <Link href="/payments">
            <Button variant="secondary">查看全部付款单</Button>
          </Link>
          <Link href="/payments/create">
            <Button>
              <Send className="h-4 w-4" />
              发起付款
            </Button>
          </Link>
        </>
      }
    >
      {/* Hero — mirrors 资金中台管理系统 title block on gradient */}
      <section className="mb-8 px-2 py-6 text-center text-white sm:py-10">
        <h2 className="font-display text-3xl font-bold tracking-tight drop-shadow-sm sm:text-5xl">
          付款中心管理系统
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          统一管理各子业务跨境付款，提供高效的付款申请、审核与出款服务
        </p>
      </section>

      {/* KPI strip — matches reference white metric bar */}
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

      {/* Module cards — blue square icons like reference */}
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

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon as keyof typeof iconMap];
          return (
            <Link key={action.title} href={action.href} className="group">
              <div className="flex h-full items-center gap-3 rounded-2xl border border-white/40 bg-white/15 px-4 py-3 text-white backdrop-blur-sm transition hover:bg-white/25">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-500">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{action.title}</div>
                  <div className="truncate text-xs text-white/75">{action.desc}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>最近付款单</CardTitle>
              <CardDescription>实时跟踪审核与出款进展</CardDescription>
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
                    {item.merchantName} · {item.beneficiaryName}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="font-semibold text-brand-600">
                    {formatMoney(item.amount, item.currency)}
                  </div>
                  <div className="text-xs text-ink-4">
                    约 {formatMoney(item.cnyEquivalent, "CNY")}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>待办提醒</CardTitle>
              <CardDescription>今日需优先处理的事项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <TodoItem
                icon={<Clock3 className="h-4 w-4" />}
                title="28 笔待财务审核"
                desc="含大额付款 6 笔，建议优先处理"
              />
              <TodoItem
                icon={<ShieldAlert className="h-4 w-4" />}
                title="3 笔风控复核"
                desc="高风险国家收款方，需补充用途说明"
              />
              <TodoItem
                icon={<Wallet className="h-4 w-4" />}
                title="2 笔失败待重试"
                desc="账号校验失败，可修正后一键重推"
              />
            </CardContent>
          </Card>

          <Card id="channels">
            <CardHeader>
              <CardTitle>通道健康度</CardTitle>
              <CardDescription>今日各付款通道运行概况</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {channelStats.map((ch) => (
                <div
                  key={ch.name}
                  className="rounded-xl border border-slate-100 px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-ink-1">
                      {ch.name}
                    </span>
                    <span className="text-xs text-emerald-600">{ch.success}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-ink-4">
                    <span>时效 {ch.latency}</span>
                    <span>负载 {ch.load}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <section id="reports" className="mt-6 grid gap-4 md:grid-cols-3">
        <InsightCard
          icon={<Wallet className="h-5 w-5" />}
          title="多币种余额可用"
          desc="USD / EUR / HKD / SGD 等结算账户余额统一展示，付款前自动校验额度。"
        />
        <InsightCard
          icon={<FileSpreadsheet className="h-5 w-5" />}
          title="批量付款模板"
          desc="支持按商户、收款方、币种批量导入，系统自动拆单并触发审核流。"
        />
        <InsightCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="合规材料闭环"
          desc="合同、发票、用途说明与审批意见留痕，满足跨境出款审计要求。"
        />
      </section>
    </AppShell>
  );
}

function TodoItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-surface-soft px-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-ink-1">{title}</div>
        <div className="mt-0.5 text-xs text-ink-3">{desc}</div>
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}
