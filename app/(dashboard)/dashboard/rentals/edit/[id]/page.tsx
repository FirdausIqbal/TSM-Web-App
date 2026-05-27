import EditRentals from "@/ui/dashboard/rentals/EditRentals";
import { getRentalFormData } from "@/lib/data";

export default async function page(props: { params: Promise<{id:string}> }) {
    const params = await props.params;
    const rentalData = await getRentalFormData(params.id);

  return (
    <EditRentals rentalData={rentalData.data} />
  )
}
