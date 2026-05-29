/**
 * Format currency idr
 * fn() untuk format angka uang
 */

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
/**
 * Format Date
 * fn() untuk format waktu tanggal - bulan - tahun (readable)
 * return string(date)
 */
export function formatDate (date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 
 * @param startDate tanggal mulai
 * @param endDate tanggal selesai
 * @returns number (total berapa hari)
 */
export function calculateDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diff = end.getTime() - start.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * fn() function untuk memberi style pada status rentals
 */

export function formatStyleStatus(status: string) {
  switch (status) {
    case "BOOKED":
      return "bg-yellow-600 text-white";
    case "COMPLETED":
      return "bg-green-600 text-white";
    case "ON_GOING":
      return "bg-blue-600 text-white";
    case "CANCELLED":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
}
