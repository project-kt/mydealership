import React, { ReactElement } from "react";
import { Tables } from "../../../../../types/database.types";

type CarOrderProps = {
  carOrder: Tables<"CarOrder">;
};

export default function CarOrder({ carOrder }: CarOrderProps): ReactElement | undefined {
  // TODO: Migrate to PostgreSQL
  // This component is temporarily disabled during migration
  return <div className="p-4 text-center text-gray-500">Order details temporarily unavailable during migration</div>;
}
