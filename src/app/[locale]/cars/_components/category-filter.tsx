import React, { ReactElement } from "react";
import { query } from "@/db/config";
import { Tables } from "../../../../../types/database.types";
import CategorySelect from "./category-select";

export default async function CategoryFilter(): Promise<ReactElement | undefined> {
  try {
    const result = await query<Tables<"Category">>('SELECT * FROM "Category" ORDER BY name ASC');

    if (result.rows.length > 0) {
      return <CategorySelect categories={result.rows} />;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  return undefined;
}
