import React, { ReactElement } from "react";
import { query } from "@/db/config";
import { Tables } from "../../../../../types/database.types";
import ManufacturersSelect from "./manufacturers-select";

export default async function ManufacturersFilter(): Promise<ReactElement | undefined> {
  try {
    const result = await query<Tables<"Manufacturer">>('SELECT * FROM "Manufacturer" ORDER BY name ASC');

    if (result.rows.length > 0) {
      return <ManufacturersSelect manufacturers={result.rows} />;
    }
  } catch (error) {
    console.error("Error fetching manufacturers:", error);
  }

  return undefined;
}
