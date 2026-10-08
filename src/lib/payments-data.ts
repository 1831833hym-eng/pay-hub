export type FeishuApprovalStatus =
  | "approved"
  | "approving"
  | "rejected"
  | "cancelled";

export type PaymentOrderStatus =
  | "draft"
  | "pending_review"
  | "review_rejected"
  | "ready_to_pay"
  | "paying"
  | "paid"
  | "pay_failed"
  | "receipt_synced"
  | "closed";

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "HKD" | "CNY" | "SGD";

/** 付款申请类型 */
export type PaymentApplicationType =
  | "供应商货款"
  | "物流仓储费"
  | "广告投放费"
  | "服务费"
  | "其他";

export const APPLICATION_TYPES: PaymentApplicationType[] = [
  "供应商货款",
  "物流仓储费",
  "广告投放费",
  "服务费",
  "其他",
];

export interface FeishuApproval {
  id: string;
  instanceCode: string;
  title: string;
  applicant: string;
  department: string;
  amount: number;
  currency: Currency;
  payeeName: string;
  payeeBank: string;
  payeeAccountMasked: string;
  purpose: string;
  applicationType: PaymentApplicationType;
  approvedAt: string;
  status: FeishuApprovalStatus;
  linkedOrderId?: string;
  attachmentCount: number;
}

export interface PaymentOrder {
  id: string;
  /** 付款单编号 */
  orderNo: string;
  feishuId: string;
  /** 飞书审批编号 */
  feishuInstanceCode: string;
  /** 付款申请类型 */
  applicationType: PaymentApplicationType;
  /** 付款事由 */
  purpose: string;
  /** 付款金额 */
  amount: number;
  /** 币种 */
  currency: Currency;
  /** 申请人 */
  applicant: string;
  /** 申请时间（飞书侧申请时间） */
  appliedAt: string;
  /** 付款单状态 */
  status: PaymentOrderStatus;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  merchantName: string;
  payeeName: string;
  payeeBank: string;
  payeeAccountMasked: string;
  cnyEquivalent: number;
  reviewer?: string;
  reviewComment?: string;
  worldfirstTxId?: string;
  worldfirstStatus?: string;
  receiptNo?: string;
  receiptSyncedAt?: string;
  timeline: { time: string; title: string; desc: string; actor: string }[];
}

export const FEISHU_STATUS_META: Record<
  FeishuApprovalStatus,
  { label: string; tone: string; bg: string }
> = {
  approved: { label: "审批通过", tone: "text-emerald-700", bg: "bg-emerald-50" },
  approving: { label: "审批中", tone: "text-amber-700", bg: "bg-amber-50" },
  rejected: { label: "已驳回", tone: "text-rose-700", bg: "bg-rose-50" },
  cancelled: { label: "已撤销", tone: "text-ink-3", bg: "bg-slate-100" },
};

export const ORDER_STATUS_META: Record<
  PaymentOrderStatus,
  { label: string; tone: string; bg: string }
> = {
  draft: { label: "草稿", tone: "text-ink-3", bg: "bg-slate-100" },
  pending_review: {
    label: "待复核",
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  review_rejected: {
    label: "复核驳回",
    tone: "text-rose-700",
    bg: "bg-rose-50",
  },
  ready_to_pay: {
    label: "待出款",
    tone: "text-sky-700",
    bg: "bg-sky-50",
  },
  paying: { label: "万里汇出款中", tone: "text-brand-700", bg: "bg-brand-50" },
  paid: { label: "已付款", tone: "text-emerald-700", bg: "bg-emerald-50" },
  pay_failed: { label: "出款失败", tone: "text-rose-700", bg: "bg-rose-50" },
  receipt_synced: {
    label: "回单已回传",
    tone: "text-emerald-800",
    bg: "bg-emerald-50",
  },
  closed: { label: "已关闭", tone: "text-ink-3", bg: "bg-slate-100" },
};

/** @deprecated use ORDER_STATUS_META */
export const STATUS_META = ORDER_STATUS_META;
/** @deprecated */
export type PaymentStatus = PaymentOrderStatus;

export const feishuApprovals: FeishuApproval[] = [
  {
    id: "fs-001",
    instanceCode: "FS20260328001",
    title: "FBA仓储尾程费用付款申请",
    applicant: "王晓雯",
    department: "跨境运营一部",
    amount: 12850,
    currency: "USD",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeBank: "JPMorgan Chase",
    payeeAccountMasked: "****4821",
    purpose: "FBA仓储与尾程费用 · 2026-03 上半月",
    applicationType: "物流仓储费",
    approvedAt: "2026-03-28T09:05:00+08:00",
    status: "approved",
    linkedOrderId: "pay-1001",
    attachmentCount: 3,
  },
  {
    id: "fs-002",
    instanceCode: "FS20260328002",
    title: "欧洲仓代发服务费",
    applicant: "李明轩",
    department: "供应链中心",
    amount: 6420.5,
    currency: "EUR",
    payeeName: "EuroPack Logistics GmbH",
    payeeBank: "Deutsche Bank",
    payeeAccountMasked: "****1176",
    purpose: "欧洲仓一件代发服务费",
    applicationType: "物流仓储费",
    approvedAt: "2026-03-28T10:20:00+08:00",
    status: "approved",
    linkedOrderId: "pay-1002",
    attachmentCount: 2,
  },
  {
    id: "fs-003",
    instanceCode: "FS20260327018",
    title: "东南亚广告投放结算",
    applicant: "赵一诺",
    department: "增长市场部",
    amount: 9800,
    currency: "SGD",
    payeeName: "Singapore Ads Pte. Ltd.",
    payeeBank: "DBS Bank",
    payeeAccountMasked: "****7742",
    purpose: "东南亚广告投放结算",
    applicationType: "广告投放费",
    approvedAt: "2026-03-27T16:40:00+08:00",
    status: "approved",
    linkedOrderId: "pay-1003",
    attachmentCount: 4,
  },
  {
    id: "fs-004",
    instanceCode: "FS20260328004",
    title: "采购货款-3月批次",
    applicant: "王晓雯",
    department: "跨境运营一部",
    amount: 186000,
    currency: "HKD",
    payeeName: "Shenzhen Huaqiang Supply Co.",
    payeeBank: "招商银行香港分行",
    payeeAccountMasked: "****9033",
    purpose: "采购货款-3月批次",
    applicationType: "供应商货款",
    approvedAt: "2026-03-28T11:00:00+08:00",
    status: "approved",
    attachmentCount: 5,
  },
  {
    id: "fs-005",
    instanceCode: "FS20260328005",
    title: "日本站内容营销服务费",
    applicant: "孙可",
    department: "品牌市场部",
    amount: 450000,
    currency: "JPY",
    payeeName: "Tokyo Media Agency KK",
    payeeBank: "MUFG Bank",
    payeeAccountMasked: "****5520",
    purpose: "日本站内容营销服务费",
    applicationType: "服务费",
    approvedAt: "2026-03-28T11:30:00+08:00",
    status: "approving",
    attachmentCount: 2,
  },
  {
    id: "fs-006",
    instanceCode: "FS20260326018",
    title: "仓储超期费补缴",
    applicant: "李明轩",
    department: "供应链中心",
    amount: 5200,
    currency: "USD",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeBank: "JPMorgan Chase",
    payeeAccountMasked: "****4821",
    purpose: "仓储超期费补缴",
    applicationType: "物流仓储费",
    approvedAt: "2026-03-26T09:10:00+08:00",
    status: "approved",
    linkedOrderId: "pay-1006",
    attachmentCount: 2,
  },
];

export const payments: PaymentOrder[] = [
  {
    id: "pay-1001",
    orderNo: "PAY20260328001",
    feishuId: "fs-001",
    feishuInstanceCode: "FS20260328001",
    applicationType: "物流仓储费",
    purpose: "FBA仓储与尾程费用 · 2026-03 上半月",
    amount: 12850,
    currency: "USD",
    applicant: "王晓雯",
    appliedAt: "2026-03-28T08:40:00+08:00",
    status: "pending_review",
    createdAt: "2026-03-28T09:12:00+08:00",
    updatedAt: "2026-03-28T09:12:00+08:00",
    merchantName: "星辰跨境旗舰店",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeBank: "JPMorgan Chase",
    payeeAccountMasked: "****4821",
    cnyEquivalent: 93212.5,
    timeline: [
      {
        time: "2026-03-28 09:05",
        title: "飞书审批通过",
        desc: "审批实例 FS20260328001 已通过，付款中心已承接申请信息",
        actor: "飞书审批",
      },
      {
        time: "2026-03-28 09:12",
        title: "生成付款单",
        desc: "系统根据飞书字段自动生成付款单，待财务复核",
        actor: "系统",
      },
    ],
  },
  {
    id: "pay-1002",
    orderNo: "PAY20260328002",
    feishuId: "fs-002",
    feishuInstanceCode: "FS20260328002",
    applicationType: "物流仓储费",
    purpose: "欧洲仓一件代发服务费",
    amount: 6420.5,
    currency: "EUR",
    applicant: "李明轩",
    appliedAt: "2026-03-28T09:50:00+08:00",
    status: "paying",
    createdAt: "2026-03-28T10:25:00+08:00",
    updatedAt: "2026-03-28T11:05:00+08:00",
    merchantName: "蓝海数贸",
    payeeName: "EuroPack Logistics GmbH",
    payeeBank: "Deutsche Bank",
    payeeAccountMasked: "****1176",
    cnyEquivalent: 50248.3,
    reviewer: "财务-陈静",
    reviewComment: "材料齐全，额度校验通过",
    worldfirstTxId: "WF20260328110500981",
    worldfirstStatus: "PROCESSING",
    timeline: [
      {
        time: "2026-03-28 10:20",
        title: "飞书审批通过",
        desc: "付款申请信息已同步至付款中心",
        actor: "飞书审批",
      },
      {
        time: "2026-03-28 10:25",
        title: "生成付款单",
        desc: "自动生成付款单 PAY20260328002",
        actor: "系统",
      },
      {
        time: "2026-03-28 10:48",
        title: "复核通过",
        desc: "财务复核通过，准备调用万里汇付款接口",
        actor: "财务-陈静",
      },
      {
        time: "2026-03-28 11:05",
        title: "提交万里汇出款",
        desc: "已调用万里汇付款接口，交易号 WF20260328110500981",
        actor: "系统",
      },
    ],
  },
  {
    id: "pay-1003",
    orderNo: "PAY20260327018",
    feishuId: "fs-003",
    feishuInstanceCode: "FS20260327018",
    applicationType: "广告投放费",
    purpose: "东南亚广告投放结算",
    amount: 9800,
    currency: "SGD",
    applicant: "赵一诺",
    appliedAt: "2026-03-27T15:20:00+08:00",
    status: "receipt_synced",
    createdAt: "2026-03-27T16:50:00+08:00",
    updatedAt: "2026-03-28T09:40:00+08:00",
    merchantName: "北极光品牌",
    payeeName: "Singapore Ads Pte. Ltd.",
    payeeBank: "DBS Bank",
    payeeAccountMasked: "****7742",
    cnyEquivalent: 53116,
    reviewer: "财务-陈静",
    worldfirstTxId: "WF20260327172000412",
    worldfirstStatus: "SUCCESS",
    receiptNo: "WFR-20260328-00412",
    receiptSyncedAt: "2026-03-28T09:40:00+08:00",
    timeline: [
      {
        time: "2026-03-27 16:40",
        title: "飞书审批通过",
        desc: "审批通过并同步付款要素",
        actor: "飞书审批",
      },
      {
        time: "2026-03-27 16:50",
        title: "生成付款单",
        desc: "付款单已创建并进入复核",
        actor: "系统",
      },
      {
        time: "2026-03-27 17:10",
        title: "复核通过",
        desc: "复核通过，提交万里汇出款",
        actor: "财务-陈静",
      },
      {
        time: "2026-03-27 17:20",
        title: "万里汇付款成功",
        desc: "交易号 WF20260327172000412 出款成功",
        actor: "万里汇",
      },
      {
        time: "2026-03-28 09:30",
        title: "获取万里汇回单",
        desc: "回单号 WFR-20260328-00412 已拉取",
        actor: "系统",
      },
      {
        time: "2026-03-28 09:40",
        title: "回单回传飞书",
        desc: "回单已上传至飞书审批实例附件，流程闭环",
        actor: "系统",
      },
    ],
  },
  {
    id: "pay-1006",
    orderNo: "PAY20260326011",
    feishuId: "fs-006",
    feishuInstanceCode: "FS20260326018",
    applicationType: "物流仓储费",
    purpose: "仓储超期费补缴",
    amount: 5200,
    currency: "USD",
    applicant: "李明轩",
    appliedAt: "2026-03-26T08:30:00+08:00",
    status: "pay_failed",
    createdAt: "2026-03-26T09:20:00+08:00",
    updatedAt: "2026-03-26T17:20:00+08:00",
    merchantName: "蓝海数贸",
    payeeName: "Amazon Fulfillment Services Inc.",
    payeeBank: "JPMorgan Chase",
    payeeAccountMasked: "****4821",
    cnyEquivalent: 37700,
    reviewer: "财务-陈静",
    worldfirstTxId: "WF20260326140000771",
    worldfirstStatus: "FAILED",
    reviewComment: "账号校验失败，待修正后重推",
    timeline: [
      {
        time: "2026-03-26 09:10",
        title: "飞书审批通过",
        desc: "付款申请已承接",
        actor: "飞书审批",
      },
      {
        time: "2026-03-26 09:20",
        title: "生成付款单并复核通过",
        desc: "复核通过后提交万里汇",
        actor: "财务-陈静",
      },
      {
        time: "2026-03-26 17:20",
        title: "万里汇出款失败",
        desc: "收款账号校验失败，可修正后重新调用付款接口",
        actor: "万里汇",
      },
    ],
  },
  {
    id: "pay-1004",
    orderNo: "PAY20260328004",
    feishuId: "fs-004",
    feishuInstanceCode: "FS20260328004",
    applicationType: "供应商货款",
    purpose: "采购货款-3月批次",
    amount: 186000,
    currency: "HKD",
    applicant: "王晓雯",
    appliedAt: "2026-03-28T10:15:00+08:00",
    status: "ready_to_pay",
    createdAt: "2026-03-28T11:10:00+08:00",
    updatedAt: "2026-03-28T11:45:00+08:00",
    merchantName: "星辰跨境旗舰店",
    payeeName: "Shenzhen Huaqiang Supply Co.",
    payeeBank: "招商银行香港分行",
    payeeAccountMasked: "****9033",
    cnyEquivalent: 170220,
    reviewer: "财务-陈静",
    reviewComment: "大额付款已二次核对合同与发票",
    timeline: [
      {
        time: "2026-03-28 11:00",
        title: "飞书审批通过",
        desc: "大额采购付款审批通过",
        actor: "飞书审批",
      },
      {
        time: "2026-03-28 11:10",
        title: "生成付款单",
        desc: "已从飞书字段映射生成付款单",
        actor: "系统",
      },
      {
        time: "2026-03-28 11:45",
        title: "复核通过",
        desc: "待提交万里汇付款接口",
        actor: "财务-陈静",
      },
    ],
  },
];

export const overviewStats = [
  {
    label: "待承接飞书单",
    value: "1",
    hint: "审批通过尚未生成付款单",
    trend: "warn" as const,
  },
  {
    label: "待复核",
    value: "1",
    hint: "提交后可调用万里汇出款",
    trend: "warn" as const,
  },
  {
    label: "万里汇出款中",
    value: "1",
    hint: "等待付款结果与回单",
    trend: "neutral" as const,
  },
  {
    label: "回单已回传",
    value: "12",
    hint: "本月已闭环飞书审批",
    trend: "up" as const,
  },
];

export const flowSteps = [
  {
    step: "01",
    title: "承接飞书审批",
    desc: "监听飞书付款审批通过事件，拉取申请字段与附件。",
  },
  {
    step: "02",
    title: "生成付款单",
    desc: "将审批信息映射为付款单，补齐商户、账户等出款要素。",
  },
  {
    step: "03",
    title: "提交复核",
    desc: "财务复核通过后，付款单进入可出款状态。",
  },
  {
    step: "04",
    title: "万里汇出款",
    desc: "调用万里汇付款接口执行跨境付款。",
  },
  {
    step: "05",
    title: "回单回传飞书",
    desc: "获取万里汇回单，并上传至原飞书审批流附件。",
  },
];

export function getPaymentById(id: string) {
  return payments.find((item) => item.id === id);
}

export function getFeishuById(id: string) {
  return feishuApprovals.find((item) => item.id === id);
}

export function getPaymentsByStatus(status: PaymentOrderStatus) {
  return payments.filter((item) => item.status === status);
}
