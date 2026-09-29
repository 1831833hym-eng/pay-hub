export type PaymentStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "paying"
  | "success"
  | "failed"
  | "rejected";

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "HKD" | "CNY" | "SGD";

export interface Beneficiary {
  id: string;
  name: string;
  country: string;
  bankName: string;
  accountMasked: string;
  currency: Currency;
  type: "供应商" | "物流商" | "服务商" | "个人";
  status: "已认证" | "审核中" | "已停用";
}

export interface PaymentOrder {
  id: string;
  orderNo: string;
  merchantName: string;
  beneficiaryName: string;
  beneficiaryId: string;
  amount: number;
  currency: Currency;
  cnyEquivalent: number;
  purpose: string;
  channel: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  applicant: string;
  payerAccount: string;
  remark?: string;
  timeline: { time: string; title: string; desc: string; actor: string }[];
}

export const STATUS_META: Record<
  PaymentStatus,
  { label: string; tone: string; bg: string }
> = {
  draft: { label: "草稿", tone: "text-ink-3", bg: "bg-slate-100" },
  pending_review: {
    label: "待审核",
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  approved: { label: "已审批", tone: "text-sky-700", bg: "bg-sky-50" },
  paying: { label: "付款中", tone: "text-brand-700", bg: "bg-brand-50" },
  success: { label: "付款成功", tone: "text-emerald-700", bg: "bg-emerald-50" },
  failed: { label: "付款失败", tone: "text-rose-700", bg: "bg-rose-50" },
  rejected: { label: "已驳回", tone: "text-rose-700", bg: "bg-rose-50" },
};

export const beneficiaries: Beneficiary[] = [
  {
    id: "ben-001",
    name: "Amazon Fulfillment Services Inc.",
    country: "美国",
    bankName: "JPMorgan Chase",
    accountMasked: "****4821",
    currency: "USD",
    type: "物流商",
    status: "已认证",
  },
  {
    id: "ben-002",
    name: "Shenzhen Huaqiang Supply Co.",
    country: "中国",
    bankName: "招商银行香港分行",
    accountMasked: "****9033",
    currency: "HKD",
    type: "供应商",
    status: "已认证",
  },
  {
    id: "ben-003",
    name: "EuroPack Logistics GmbH",
    country: "德国",
    bankName: "Deutsche Bank",
    accountMasked: "****1176",
    currency: "EUR",
    type: "物流商",
    status: "已认证",
  },
  {
    id: "ben-004",
    name: "Tokyo Media Agency KK",
    country: "日本",
    bankName: "MUFG Bank",
    accountMasked: "****5520",
    currency: "JPY",
    type: "服务商",
    status: "审核中",
  },
  {
    id: "ben-005",
    name: "Singapore Ads Pte. Ltd.",
    country: "新加坡",
    bankName: "DBS Bank",
    accountMasked: "****7742",
    currency: "SGD",
    type: "服务商",
    status: "已认证",
  },
];

export const payments: PaymentOrder[] = [
  {
    id: "pay-1001",
    orderNo: "PAY20260328001",
    merchantName: "星辰跨境旗舰店",
    beneficiaryName: "Amazon Fulfillment Services Inc.",
    beneficiaryId: "ben-001",
    amount: 12850.0,
    currency: "USD",
    cnyEquivalent: 93212.5,
    purpose: "FBA仓储与尾程费用",
    channel: "SWIFT / 合作银行通道",
    status: "pending_review",
    createdAt: "2026-03-28T09:12:00+08:00",
    updatedAt: "2026-03-28T09:12:00+08:00",
    applicant: "王晓雯",
    payerAccount: "USD结算户 ****6612",
    remark: "对应结算周期 2026-03-01 ~ 2026-03-15",
    timeline: [
      {
        time: "2026-03-28 09:12",
        title: "提交付款申请",
        desc: "申请人已提交付款单，等待风控与财务审核",
        actor: "王晓雯",
      },
    ],
  },
  {
    id: "pay-1002",
    orderNo: "PAY20260327018",
    merchantName: "蓝海数贸",
    beneficiaryName: "EuroPack Logistics GmbH",
    beneficiaryId: "ben-003",
    amount: 6420.5,
    currency: "EUR",
    cnyEquivalent: 50248.3,
    purpose: "欧洲仓一件代发服务费",
    channel: "SEPA 合作通道",
    status: "paying",
    createdAt: "2026-03-27T16:40:00+08:00",
    updatedAt: "2026-03-28T08:05:00+08:00",
    applicant: "李明轩",
    payerAccount: "EUR结算户 ****2281",
    timeline: [
      {
        time: "2026-03-27 16:40",
        title: "提交付款申请",
        desc: "付款单已创建",
        actor: "李明轩",
      },
      {
        time: "2026-03-27 18:10",
        title: "财务审核通过",
        desc: "材料齐全，额度校验通过",
        actor: "财务-陈静",
      },
      {
        time: "2026-03-28 08:05",
        title: "通道受理中",
        desc: "已推送至 SEPA 合作通道",
        actor: "系统",
      },
    ],
  },
  {
    id: "pay-1003",
    orderNo: "PAY20260326007",
    merchantName: "北极光品牌",
    beneficiaryName: "Singapore Ads Pte. Ltd.",
    beneficiaryId: "ben-005",
    amount: 9800.0,
    currency: "SGD",
    cnyEquivalent: 53116.0,
    purpose: "东南亚广告投放结算",
    channel: "本地清算通道",
    status: "success",
    createdAt: "2026-03-26T11:20:00+08:00",
    updatedAt: "2026-03-26T15:48:00+08:00",
    applicant: "赵一诺",
    payerAccount: "SGD结算户 ****4409",
    timeline: [
      {
        time: "2026-03-26 11:20",
        title: "提交付款申请",
        desc: "付款单已创建",
        actor: "赵一诺",
      },
      {
        time: "2026-03-26 13:02",
        title: "审核通过",
        desc: "风控与财务双重通过",
        actor: "财务-陈静",
      },
      {
        time: "2026-03-26 15:48",
        title: "付款成功",
        desc: "收款方银行已入账",
        actor: "系统",
      },
    ],
  },
  {
    id: "pay-1004",
    orderNo: "PAY20260325022",
    merchantName: "星辰跨境旗舰店",
    beneficiaryName: "Shenzhen Huaqiang Supply Co.",
    beneficiaryId: "ben-002",
    amount: 186000.0,
    currency: "HKD",
    cnyEquivalent: 170220.0,
    purpose: "采购货款-3月批次",
    channel: "FPS / 香港本地",
    status: "rejected",
    createdAt: "2026-03-25T10:05:00+08:00",
    updatedAt: "2026-03-25T14:30:00+08:00",
    applicant: "王晓雯",
    payerAccount: "HKD结算户 ****1188",
    remark: "合同附件缺失，请补充后重新提交",
    timeline: [
      {
        time: "2026-03-25 10:05",
        title: "提交付款申请",
        desc: "付款单已创建",
        actor: "王晓雯",
      },
      {
        time: "2026-03-25 14:30",
        title: "审核驳回",
        desc: "缺少采购合同扫描件与发票",
        actor: "风控-周然",
      },
    ],
  },
  {
    id: "pay-1005",
    orderNo: "PAY20260328009",
    merchantName: "云帆出海",
    beneficiaryName: "Tokyo Media Agency KK",
    beneficiaryId: "ben-004",
    amount: 450000,
    currency: "JPY",
    cnyEquivalent: 21735.0,
    purpose: "日本站内容营销服务费",
    channel: "SWIFT",
    status: "draft",
    createdAt: "2026-03-28T10:40:00+08:00",
    updatedAt: "2026-03-28T10:40:00+08:00",
    applicant: "孙可",
    payerAccount: "JPY结算户 ****3301",
    timeline: [
      {
        time: "2026-03-28 10:40",
        title: "保存草稿",
        desc: "收款方认证未完成，暂存草稿",
        actor: "孙可",
      },
    ],
  },
  {
    id: "pay-1006",
    orderNo: "PAY20260324011",
    merchantName: "蓝海数贸",
    beneficiaryName: "Amazon Fulfillment Services Inc.",
    beneficiaryId: "ben-001",
    amount: 5200.0,
    currency: "USD",
    cnyEquivalent: 37700.0,
    purpose: "仓储超期费补缴",
    channel: "SWIFT / 合作银行通道",
    status: "failed",
    createdAt: "2026-03-24T09:00:00+08:00",
    updatedAt: "2026-03-24T17:20:00+08:00",
    applicant: "李明轩",
    payerAccount: "USD结算户 ****6612",
    remark: "中间行退回：收款账号校验失败",
    timeline: [
      {
        time: "2026-03-24 09:00",
        title: "提交付款申请",
        desc: "付款单已创建",
        actor: "李明轩",
      },
      {
        time: "2026-03-24 11:15",
        title: "审核通过并出款",
        desc: "已推送 SWIFT",
        actor: "系统",
      },
      {
        time: "2026-03-24 17:20",
        title: "付款失败",
        desc: "中间行退回，账号校验失败",
        actor: "系统",
      },
    ],
  },
];

export const overviewStats = [
  {
    label: "今日付款额",
    value: "¥186.4万",
    hint: "较昨日 +12.6%",
    trend: "up" as const,
  },
  {
    label: "待审核付款",
    value: "28",
    hint: "需在 2 小时内处理",
    trend: "warn" as const,
  },
  {
    label: "付款中",
    value: "14",
    hint: "含跨境通道 9 笔",
    trend: "neutral" as const,
  },
  {
    label: "本月成功率",
    value: "97.8%",
    hint: "失败 11 笔已重试",
    trend: "up" as const,
  },
];

export const quickActions = [
  {
    title: "发起单笔付款",
    desc: "选择付款账户与收款方，提交审核",
    href: "/payments/create",
    icon: "send",
  },
  {
    title: "批量付款导入",
    desc: "按模板上传 Excel，批量生成付款单",
    href: "/payments/create?mode=batch",
    icon: "upload",
  },
  {
    title: "收款方管理",
    desc: "维护供应商与海外收款账户",
    href: "/beneficiaries",
    icon: "users",
  },
  {
    title: "付款单查询",
    desc: "按状态、币种、商户筛选付款记录",
    href: "/payments",
    icon: "list",
  },
];

export function getPaymentById(id: string) {
  return payments.find((item) => item.id === id);
}
