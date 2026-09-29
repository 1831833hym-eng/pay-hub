import { Suspense } from "react";
import CreatePaymentPage from "./create-client";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-page-gradient p-10 text-center text-white">
          加载中…
        </div>
      }
    >
      <CreatePaymentPage />
    </Suspense>
  );
}
