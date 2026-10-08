export type PaymentStatus =
  | "pending_submit"
  | "pending_review"
  | "pending_pay"
  | "pending_receipt"
  | "completed"
  | "review_rejected";

export type PaymentApplyType =
  | "物流费用"
  | "采购货款"
  | "广告投放"
  | "服务费"
  | "仓储费用"
  | "其他";

/** 收款方式类型 */
export type PaymentMethodType =
  | "银行转账"
  | "本地清算"
  | "钱包付款"
  | "其他";

/** 收款人账户类型 */
export type PayeeAccountType =
  | "对公账户"
  | "对私账户"
  | "第三方支付账户";

export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "HKD" | "CNY" | "SGD";

export interface PaymentOrder {
  id: string;
  /** 付款单编号 */
  orderNo: string;
  /** 飞书审批编号 */
  feishuNo: string;
  /** 付款申请类型 */
  applyType: PaymentApplyType;
  /** 付款事由 */
  purpose: string;
  /** 付款金额 */
  amount: number;
  /** 币种 */
  currency: Currency;
  /** 申请人 */
  applicant: string;
  /** 申请时间 */
  appliedAt: string;
  /** 付款单状态 */
  status: PaymentStatus;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 收款方式类型 */
  paymentMethodType: PaymentMethodType;
  /** 收款人账户类型 */
  payeeAccountType: PayeeAccountType;
  /** 收款账号 */
  payeeAccountNo: string;
  /** 收款银行 */
  payeeBank: string;
  /** 转账附言（默认飞书审批编号） */
  transferMemo: string;
  /** 收款方名称 */
  payeeName?: string;
  remark?: string;
  worldfirstTxId?: string;
  receiptNo?: string;
}

export const STATUS_META: Record<
  PaymentStatus,
  { label: string; tone: string; bg: string }
> = {
  pending_submit: {
    label: "待提交",
    tone: "text-slate-700",
    bg: "bg-slate-100",
  },
  pending_review: {
    label: "待复核",
    tone: "text-amber-700",
    bg: "bg-amber-50",
  },
  pending_pay: {
    label: "待付款",
    tone: "text-sky-700",
    bg: "bg-sky-50",
  },
  pending_receipt: {
    label: "待回单",
    tone: "text-brand-700",
    bg: "bg-brand-50",
  },
  completed: {
    label: "已完成",
    tone: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  review_rejected: {
    label: "复核驳回",
    tone: "text-rose-700",
    bg: "bg-rose-50",
  },
};

export const APPLY_TYPES: PaymentApplyType[] = [
  "物流费用",
  "采购货款",
  "广告投放",
  "服务费",
  "仓储费用",
  "其他",
];

export const PAYMENT_METHOD_TYPES: PaymentMethodType[] = [
  "银行转账",
  "本地清算",
  "钱包付款",
  "其他",
];

export const PAYEE_ACCOUNT_TYPES: PayeeAccountType[] = [
  "对公账户",
  "对私账户",
  "第三方支付账户",
];

export const STATUS_FLOW = [
  { key: "pending_submit", label: "待提交", desc: "承接飞书审批后生成" },
  { key: "pending_review", label: "待复核", desc: "提交付款单后" },
  { key: "pending_pay", label: "待付款", desc: "复核通过后" },
  { key: "pending_receipt", label: "待回单", desc: "万里汇付款成功后" },
  { key: "completed", label: "已完成", desc: "获取回单并回传飞书" },
] as const;

/** 可变内存数据，供原型交互更新状态 */
export let paymentOrders: PaymentOrder[] = [
  {
    id: "pay-001",
    orderNo: "PAY20260328001",
    feishuNo: "FS20260328001",
    applyType: "仓储费用",
    purpose: "FBA仓储与尾程费用 · 2026-03 上半月",
    amount: 12850,
    currency: "USD",
    applicant: "王晓雯",
    appliedAt: "2026-03-28T09:05:00+08:00",
    status: "pending_submit",
    createdAt: "2026-03-28T09:12:00+08:00",
    updatedAt: "2026-03-28T09:12:00+08:00",
    paymentMethodType: "银行转账",
    payeeAccountType: "对公账户",
    payeeAccountNo: "483920184821",
    payeeBank: "JPMorgan Chase",
    transferMemo: "FS20260328001",
    payeeName: "Amazon Fulfillment Services Inc.",
  },
  {
    id: "pay-002",
    orderNo: "PAY20260328002",
    feishuNo: "FS20260328002",
    applyType: "物流费用",
    purpose: "欧洲仓一件代发服务费",
    amount: 6420.5,
    currency: "EUR",
    applicant: "李明轩",
    appliedAt: "2026-03-28T10:20:00+08:00",
    status: "pending_submit",
    createdAt: "2026-03-28T10:25:00+08:00",
    updatedAt: "2026-03-28T10:25:00+08:00",
    paymentMethodType: "本地清算",
    payeeAccountType: "对公账户",
    payeeAccountNo: "DE89370400440532011776",
    payeeBank: "Deutsche Bank",
    transferMemo: "FS20260328002",
    payeeName: "EuroPack Logistics GmbH",
  },
  {
    id: "pay-003",
    orderNo: "PAY20260328003",
    feishuNo: "FS20260328003",
    applyType: "采购货款",
    purpose: "采购货款-3月批次",
    amount: 186000,
    currency: "HKD",
    applicant: "王晓雯",
    appliedAt: "2026-03-28T11:00:00+08:00",
    status: "pending_submit",
    createdAt: "2026-03-28T11:10:00+08:00",
    updatedAt: "2026-03-28T11:10:00+08:00",
    paymentMethodType: "银行转账",
    payeeAccountType: "对公账户",
    payeeAccountNo: "012875903301",
    payeeBank: "招商银行香港分行",
    transferMemo: "FS20260328003",
    payeeName: "Shenzhen Huaqiang Supply Co.",
  },
  {
    id: "pay-004",
    orderNo: "PAY20260327018",
    feishuNo: "FS20260327018",
    applyType: "广告投放",
    purpose: "东南亚广告投放结算",
    amount: 9800,
    currency: "SGD",
    applicant: "赵一诺",
    appliedAt: "2026-03-27T16:40:00+08:00",
    status: "pending_review",
    createdAt: "2026-03-27T16:50:00+08:00",
    updatedAt: "2026-03-28T08:30:00+08:00",
    paymentMethodType: "银行转账",
    payeeAccountType: "对公账户",
    payeeAccountNo: "072034567742",
    payeeBank: "DBS Bank",
    transferMemo: "FS20260327018",
    payeeName: "Singapore Ads Pte. Ltd.",
  },
  {
    id: "pay-005",
    orderNo: "PAY20260327009",
    feishuNo: "FS20260327009",
    applyType: "服务费",
    purpose: "日本站内容营销服务费",
    amount: 450000,
    currency: "JPY",
    applicant: "孙可",
    appliedAt: "2026-03-27T14:10:00+08:00",
    status: "pending_review",
    createdAt: "2026-03-27T14:20:00+08:00",
    updatedAt: "2026-03-27T15:00:00+08:00",
    paymentMethodType: "银行转账",
    payeeAccountType: "对公账户",
    payeeAccountNo: "1002455201",
    payeeBank: "MUFG Bank",
    transferMemo: "FS20260327009",
    payeeName: "Tokyo Media Agency KK",
  },
  {
    id: "pay-006",
    orderNo: "PAY20260326011",
    feishuNo: "FS20260326011",
    applyType: "仓储费用",
    purpose: "仓储超期费补缴",
    amount: 5200,
    currency: "USD",
    applicant: "李明轩",
    appliedAt: "2026-03-26T09:10:00+08:00",
    status: "pending_pay",
    createdAt: "2026-03-26T09:20:00+08:00",
    updatedAt: "2026-03-26T11:00:00+08:00",
    paymentMethodType: "银行转账",
    payeeAccountType: "对公账户",
    payeeAccountNo: "483920184821",
    payeeBank: "JPMorgan Chase",
    transferMemo: "FS20260326011",
    payeeName: "Amazon Fulfillment Services Inc.",
  },
  {
    id: "pay-007",
    orderNo: "PAY20260325007",
    feishuNo: "FS20260325007",
    applyType: "物流费用",
    purpose: "美国尾程配送结算",
    amount: 3200,
    currency: "USD",
    applicant: "周然",
    appliedAt: "2026-03-25T10:00:00+08:00",
    status: "pending_receipt",
    createdAt: "2026-03-25T10:15:00+08:00",
    updatedAt: "2026-03-26T16:40:00+08:00",
    paymentMethodType: "银行转账",
    payeeAccountType: "对公账户",
    payeeAccountNo: "483920184821",
    payeeBank: "JPMorgan Chase",
    transferMemo: "FS20260325007",
    payeeName: "Amazon Fulfillment Services Inc.",
    worldfirstTxId: "WF202603261640001",
  },
  {
    id: "pay-008",
    orderNo: "PAY20260324003",
    feishuNo: "FS20260324003",
    applyType: "广告投放",
    purpose: "北美站投放月结",
    amount: 15600,
    currency: "USD",
    applicant: "赵一诺",
    appliedAt: "2026-03-24T13:20:00+08:00",
    status: "completed",
    createdAt: "2026-03-24T13:30:00+08:00",
    updatedAt: "2026-03-25T09:10:00+08:00",
    paymentMethodType: "钱包付款",
    payeeAccountType: "第三方支付账户",
    payeeAccountNo: "META-PAY-8891",
    payeeBank: "Meta Payments",
    transferMemo: "FS20260324003",
    payeeName: "Meta Platforms Ireland Ltd.",
    worldfirstTxId: "WF202603241800002",
    receiptNo: "WFR-20260325-0002",
  },
  {
    id: "pay-009",
    orderNo: "PAY20260323015",
    feishuNo: "FS20260323015",
    applyType: "采购货款",
    purpose: "深圳供应商货款补差",
    amount: 42000,
    currency: "HKD",
    applicant: "王晓雯",
    appliedAt: "2026-03-23T11:00:00+08:00",
    status: "review_rejected",
    createdAt: "2026-03-23T11:10:00+08:00",
    updatedAt: "2026-03-23T16:20:00+08:00",
    paymentMethodType: "银行转账",
    payeeAccountType: "对公账户",
    payeeAccountNo: "012875903301",
    payeeBank: "招商银行香港分行",
    transferMemo: "FS20260323015",
    payeeName: "Shenzhen Huaqiang Supply Co.",
    remark: "合同附件缺失，请补充后重新提交",
  },
];

export function getPaymentById(id: string) {
  return paymentOrders.find((item) => item.id === id);
}

export function updatePayment(
  id: string,
  patch: Partial<PaymentOrder>
): PaymentOrder | undefined {
  const idx = paymentOrders.findIndex((item) => item.id === id);
  if (idx < 0) return undefined;
  paymentOrders[idx] = {
    ...paymentOrders[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return paymentOrders[idx];
}

export function batchSubmit(ids: string[]) {
  const now = new Date().toISOString();
  paymentOrders = paymentOrders.map((item) =>
    ids.includes(item.id) && item.status === "pending_submit"
      ? { ...item, status: "pending_review" as const, updatedAt: now }
      : item
  );
}

export function approveReview(id: string) {
  return updatePayment(id, { status: "pending_pay" });
}

export function rejectReview(id: string, remark?: string) {
  return updatePayment(id, {
    status: "pending_submit",
    remark: remark || "复核退回，请修正后重新提交",
  });
}
