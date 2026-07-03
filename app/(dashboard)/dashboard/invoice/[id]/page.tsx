import { Suspense } from "react";
import { InvoiceDetailHeader } from "@/ui/dashboard/invoice/InvoiceDetailHeader";
import { InvoiceDetailContent } from "@/ui/dashboard/invoice/InvoiceDetailContent";
import { PaymentStatusContent } from "@/ui/dashboard/invoice/PaymentStatusContent";
import { AddPaymentContent } from "@/ui/dashboard/invoice/AddPaymentContent";
import {
  InvoiceDetailHeaderSkeleton,
  InvoiceDetailSectionSkeleton,
  PaymentStatusSectionSkeleton,
  AddPaymentFormSkeleton,
} from "@/ui/dashboard/invoice/InvoiceDetailSkeleton";

export default function InvoiceDetailPage(props: { params: Promise<{ id: string }> }) {
  return (
    <InvoiceDetailPageContent params={props.params} />
  );
}

async function InvoiceDetailPageContent(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  return (
    <div className="space-y-8 printable-area">
      {/* Header Section */}
      <Suspense fallback={<InvoiceDetailHeaderSkeleton />}>
        <InvoiceDetailHeader id={id} />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        {/* Invoice Detail Section */}
        <Suspense fallback={<InvoiceDetailSectionSkeleton />}>
          <InvoiceDetailContent id={id} />
        </Suspense>

        {/* Payment Status Section */}
        <Suspense fallback={<PaymentStatusSectionSkeleton />}>
          <PaymentStatusContent id={id} />
        </Suspense>
      </div>

      {/* Add Payment Form Section */}
      <Suspense fallback={<AddPaymentFormSkeleton />}>
        <AddPaymentContent id={id} />
      </Suspense>
    </div>
  );
}
