"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PAYMENT_CHANNEL,
  paymentOrders as seed,
  type PaymentChannel,
  type PaymentOrder,
  type PaymentStatus,
} from "@/lib/payments-data";

type Store = {
  orders: PaymentOrder[];
  getById: (id: string) => PaymentOrder | undefined;
  updateOrder: (id: string, patch: Partial<PaymentOrder>) => void;
  batchSubmit: (ids: string[]) => number;
  batchApprove: (ids: string[], channel?: PaymentChannel) => number;
  submitOne: (id: string) => boolean;
  approve: (id: string, channel?: PaymentChannel) => boolean;
  reject: (id: string, remark?: string) => boolean;
  markPaid: (id: string) => boolean;
  markReceiptDone: (id: string) => boolean;
};

const PaymentsContext = createContext<Store | null>(null);

function touch(patch: Partial<PaymentOrder> = {}): Partial<PaymentOrder> {
  return { ...patch, updatedAt: new Date().toISOString() };
}

export function PaymentsProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<PaymentOrder[]>(() =>
    seed.map((o) => ({ ...o }))
  );

  const getById = useCallback(
    (id: string) => orders.find((o) => o.id === id),
    [orders]
  );

  const updateOrder = useCallback((id: string, patch: Partial<PaymentOrder>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...touch(patch) } : o))
    );
  }, []);

  const setStatus = useCallback((id: string, status: PaymentStatus, extra?: Partial<PaymentOrder>) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, ...touch({ status, ...extra }) } : o
      )
    );
  }, []);

  const batchSubmit = useCallback((ids: string[]) => {
    let count = 0;
    setOrders((prev) =>
      prev.map((o) => {
        if (ids.includes(o.id) && o.status === "pending_submit") {
          count += 1;
          return { ...o, ...touch({ status: "pending_review" }) };
        }
        return o;
      })
    );
    return count;
  }, []);

  const batchApprove = useCallback(
    (ids: string[], channel: PaymentChannel = DEFAULT_PAYMENT_CHANNEL) => {
      let count = 0;
      setOrders((prev) =>
        prev.map((o) => {
          if (ids.includes(o.id) && o.status === "pending_review") {
            count += 1;
            return {
              ...o,
              ...touch({ status: "pending_pay", paymentChannel: channel }),
            };
          }
          return o;
        })
      );
      return count;
    },
    []
  );

  const submitOne = useCallback(
    (id: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_submit") return false;
      setStatus(id, "pending_review");
      return true;
    },
    [orders, setStatus]
  );

  const approve = useCallback(
    (id: string, channel: PaymentChannel = DEFAULT_PAYMENT_CHANNEL) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_review") return false;
      setStatus(id, "pending_pay", { paymentChannel: channel });
      return true;
    },
    [orders, setStatus]
  );

  /** 退回：状态回退为待提交，便于提交人重新编辑后再次提交 */
  const reject = useCallback(
    (id: string, remark?: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_review") return false;
      setStatus(id, "pending_submit", {
        remark: remark || "复核退回，请修正后重新提交",
        paymentChannel: undefined,
      });
      return true;
    },
    [orders, setStatus]
  );

  const markPaid = useCallback(
    (id: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_pay") return false;
      setStatus(id, "pending_receipt", {
        worldfirstTxId: `WF${Date.now().toString().slice(-10)}`,
      });
      return true;
    },
    [orders, setStatus]
  );

  const markReceiptDone = useCallback(
    (id: string) => {
      const target = orders.find((o) => o.id === id);
      if (!target || target.status !== "pending_receipt") return false;
      setStatus(id, "completed", {
        receiptNo: `WFR-${Date.now().toString().slice(-8)}`,
      });
      return true;
    },
    [orders, setStatus]
  );

  const value = useMemo(
    () => ({
      orders,
      getById,
      updateOrder,
      batchSubmit,
      batchApprove,
      submitOne,
      approve,
      reject,
      markPaid,
      markReceiptDone,
    }),
    [
      orders,
      getById,
      updateOrder,
      batchSubmit,
      batchApprove,
      submitOne,
      approve,
      reject,
      markPaid,
      markReceiptDone,
    ]
  );

  return (
    <PaymentsContext.Provider value={value}>{children}</PaymentsContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentsContext);
  if (!ctx) throw new Error("usePayments must be used within PaymentsProvider");
  return ctx;
}
