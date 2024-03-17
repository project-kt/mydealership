"use client";

import { ReactElement } from "react";
import { Table } from "@radix-ui/themes";
import useCarOrders from "@/hooks/use-car-orders";
import CarOrder from "./car-order";

export default function PaymentSessions(): ReactElement {
  const carOrders = useCarOrders();

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Car Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Plan</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {carOrders.map((carOrder, index) => (
          <CarOrder key={index} carOrder={carOrder} />
        ))}
      </Table.Body>
    </Table.Root>
  );
}
