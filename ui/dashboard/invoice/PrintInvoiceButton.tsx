"use client";

export default function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white shadow hover:bg-foreground/90 transition"
    >
      Cetak / Unduh PDF
    </button>
  );
}
