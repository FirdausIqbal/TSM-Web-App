
export type DeleteButtonProps = {
    title: string,
    message: string,
    id: string
}

export type State = {
    success?: boolean | null,
    message?: string | null
}

export type StatusValueType = "BOOKED" | "ON_GOING" | "COMPLETED" | "CANCELLED";