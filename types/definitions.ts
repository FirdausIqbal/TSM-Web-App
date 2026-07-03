
export type DeleteButtonProps<T = string> = {
    title: string;
    message: string;
    id: T;
    onDelete: (id: T) => Promise<unknown>;
}

export type State = {
    success?: boolean | null,
    message?: string | null
}

export type AddPaymentState = {
    success: boolean;
    message: string;
    data?: {
        paymentId: string;
        invoiceId: string;
        amountPaid: number;
        paymentMethod: PaymentMethodValue;
        paymentDate: Date;
    };
    errors?: {
        invoiceId?: string[];
        paymentMethod?: string[];
        amountPaid?: string[];
        paymentDate?: string[];
        proofOfPayment?: string[];
    };
}

export type VerifyPaymentState = {
    success: boolean;
    message: string;
    data?: {
        paymentId: string;
        invoiceId: string;
        status: PaymentStatusValue;
        invoiceStatus: InvoiceStatusValue;
        verifiedAmount: number;
    };
    errors?: {
        paymentId?: string[];
        invoiceId?: string[];
        actionValue?: string[];
    };
}
export interface CalendarRentalItem {
  rentalId: string;
  carId: string;
  carName: string;
  status: "BOOKED" | "ON_GOING" | "COMPLETED" | "CANCELLED"; 
  endDate: string;
  customerName: string;
}

export interface DailyCalendarData {
  date: string;
  cars: string[];
  rentals: CalendarRentalItem[]; 
}

export type StatusValueType = "BOOKED" | "ON_GOING" | "COMPLETED" | "CANCELLED";

export type InvoiceStatusValue = "UNPAID" | "PARTIAL" | "PAID" | "CANCELLED";
export type PaymentMethodValue = "TRANSFER" | "CASH" | "QRIS";
export type PaymentStatusValue = "PENDING" | "VERIFIED" | "REJECTED";

export interface InvoicePaymentRecord {
  id: string;
  invoiceId: string;
  paymentMethod: PaymentMethodValue;
  amountPaid: number;
  paymentDate: Date;
  proofOfPayment?: string | null;
  status: PaymentStatusValue;
}

export interface InvoiceRentalDetail {
  id: string;
  customerName: string;
  customerPhone: string;
  customerNik: string;
  carName: string;
  plateNumber: string;
  pricePerDay: number;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
}

export interface InvoiceDetail {
  id: string;
  orderId: string;
  invoiceNumber: string;
  totalAmount: number;
  status: InvoiceStatusValue;
  dueDate: Date;
  createdAt: Date;
}

export interface InvoiceDetailWithRelations {
  invoice: InvoiceDetail;
  payments: InvoicePaymentRecord[];
  rental: InvoiceRentalDetail | null;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  orderId: string;
  totalAmount: number;
  status: InvoiceStatusValue;
  dueDate: Date;
  createdAt: Date;
}
