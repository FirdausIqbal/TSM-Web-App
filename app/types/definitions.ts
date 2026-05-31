
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