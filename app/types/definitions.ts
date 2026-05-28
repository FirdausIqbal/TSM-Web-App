
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

export type StatusValueType = "BOOKED" | "ON_GOING" | "COMPLETED" | "CANCELLED";