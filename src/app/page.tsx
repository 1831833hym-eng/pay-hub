import Link from "next/link";
import {
  ArrowUpRight,
  Banknote,
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
import {
  overviewStats,
  payments,
  quickActions,
} from "@/lib/payments-data";
import { formatMoney } from "@/lib/utils";

const iconMap = {
  send: Send,
  upload: Upload,
  users: Users,
  list: ListOrdered,
} as const;

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
      description="统一管理跨境付款申请、审核、出款与失败重试，覆盖多币种结算账户与海外收款方。"
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
      <section className="mb-8 overflow-hidden rounded-2xl bg-white/10 px-6 py-8 text-center text-white shadow-soft backdrop-blur-sm sm:px-10">
        <p className="text-sm text-white/80">跨境电商 · 资金中台</p>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          付款中心管理系统
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
          从付款发起、合规审核到通道出款全链路可视，帮助财务与运营高效完成多主体、多币种付款。
        </p>
      </section>

      <section className="mb-6 rounded-2xl bg-white px-4 py-5 shadow-card sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:divide-x lg:divide-slate-100">
          {overviewStats.map((stat) => (
            <div key={stat.label} className="px-2 py-1 text-center lg:px-4">
              <div className="font-display text-2xl font-bold text-brand-500 sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-ink-2">{stat.label}</div>
              <div className="mt-1 text-xs text-ink-4">{stat.hint}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon as keyof typeof iconMap];
          return (
            <Link key={action.title} href={action.href} className="group">
              <Card className="h-full transition duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-soft">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="flex items-center gap-1 group-hover:text-brand-600">
                    {action.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{action.desc}</CardDescription>
                </CardHeader>
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
                icon={<Banknote className="h-4 w-4" />}
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
