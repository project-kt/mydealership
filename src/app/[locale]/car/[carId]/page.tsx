import { ReactElement } from "react";
import { Text } from "@radix-ui/themes";
import { query } from "@/db/config";
import { Tables } from "../../../../../types/database.types";
import PaymentPlansWrapper from "./_components/payment-plans-wrapper";
import CarDetail from "./_components/car-detail";

export default async function CarDetails({ params }: { params: { carId: string } }): Promise<ReactElement | undefined> {
  try {
    const result = await query<Tables<"Car">>('SELECT * FROM "Car" WHERE "carId" = $1', [Number(params.carId)]);

    if (result.rows.length > 0) {
      const car = result.rows[0];

      return (
        <div>
          <CarDetail data={car} />
          <PaymentPlansWrapper car={car} />
        </div>
      );
    } else {
      return <Text>Car not found</Text>;
    }
  } catch (error) {
    console.error("Error fetching car:", error);
    return <Text>Error loading car details</Text>;
  }
}
