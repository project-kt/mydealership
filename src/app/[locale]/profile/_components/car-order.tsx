import React, { ReactElement, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { QueryData, QueryError } from "@supabase/supabase-js";
import { Badge, Table } from "@radix-ui/themes";
import { Tables } from "../../../../../types/database.types";
import { Database } from "../../../../../types/supabase";
import RetrieveSessionButton from "./retrieve-session-button";

type CarOrderProps = {
  carOrder: Tables<"CarOrder">;
};

export default function CarOrder({ carOrder }: CarOrderProps): ReactElement | undefined {
  const supabase = createClientComponentClient<Database>();
  const [car, setCar] = useState<Tables<"Car"> | null>(null);

  const getCar = async () => {
    const query = supabase.from("Car").select("*").eq("carId", carOrder.carId);
    const { data, error }: { data: QueryData<typeof query> | null; error: QueryError | null } = await query;

    if (error) {
      console.log(error);
    }

    if (data && data.length > 0) {
      setCar(data[0]);
    }
  };

  useEffect(() => {
    getCar();
  }, []);

  if (car) {
    return (
      <Table.Row>
        <Table.RowHeaderCell>{car.title}</Table.RowHeaderCell>
        <Table.Cell>{carOrder.plan}</Table.Cell>
        <Table.Cell>
          <Badge color="orange">{carOrder.status}</Badge>
        </Table.Cell>
        <Table.Cell>{carOrder.status === "open" && <RetrieveSessionButton carOrder={carOrder} />}</Table.Cell>
      </Table.Row>
    );
  }
}
