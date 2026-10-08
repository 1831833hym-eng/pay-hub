import { redirect } from "next/navigation";

/** 付款单列表入口统一到引导页 */
export default function PaymentsIndexPage() {
  redirect("/");
}
