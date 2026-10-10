"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CompareTable } from "@/components/payments/compare-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input, Label, Select } from "@/components/ui/input";
import {
  compareOutcome,
  toCompareResults,
  type CompareOutcome,
} from "@/lib/compare-data";
import { usePayments } from "@/lib/payments-store";

export default function CompareListPage() {
  const { orders } = usePayments();
  const [draftOrderNo, setDraftOrderNo] = useState("");
  const [draftApprovalNo, setDraftApprovalNo] = useState("");
  const [draftOutcome, setDraftOutcome] = useState<CompareOutcome | "">("");
  const [orderNo, setOrderNo] = useState("");
  const [approvalNo, setApprovalNo] = useState("");
  const [outcome, setOutcome] = useState<CompareOutcome | "">("");

  const rows = useMemo(() => {
    return toCompareResults(orders).filter((item) => {
      if (
        orderNo &&
        !item.payment.docNo.toLowerCase().includes(orderNo.toLowerCase())
      )
        return false;
      if (
        approvalNo &&
        !item.approval.docNo.toLowerCase().includes(approvalNo.toLowerCase())
      )
        return false;
      if (outcome && compareOutcome(item.payment, item.approval) !== outcome)
        return false;
      return true;
    });
  }, [orders, orderNo, approvalNo, outcome]);

  return (
    <AppShell title="查询单据比对结果">
      <Card className="mb-3">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label>付款单编号</Label>
                <Input
                  value={draftOrderNo}
                  onChange={(e) => setDraftOrderNo(e.target.value)}
                  placeholder="请输入"
                />
              </div>
              <div>
                <Label>审批单号</Label>
                <Input
                  value={draftApprovalNo}
                  onChange={(e) => setDraftApprovalNo(e.target.value)}
                  placeholder="请输入"
                />
              </div>
              <div>
                <Label>比对结果</Label>
                <Select
                  value={draftOutcome}
                  onChange={(e) =>
                    setDraftOutcome((e.target.value || "") as CompareOutcome | "")
                  }
                >
                  <option value="">请选择</option>
                  <option value="一致">一致</option>
                  <option value="不一致">不一致</option>
                </Select>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                onClick={() => {
                  setOrderNo(draftOrderNo);
                  setApprovalNo(draftApprovalNo);
                  setOutcome(draftOutcome);
                }}
              >
                搜索
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setDraftOrderNo("");
                  setDraftApprovalNo("");
                  setDraftOutcome("");
                  setOrderNo("");
                  setApprovalNo("");
                  setOutcome("");
                }}
              >
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4">
          <CompareTable rows={rows} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
