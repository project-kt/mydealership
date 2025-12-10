"use client";

import { Button } from "@radix-ui/themes";
import { SearchIcon } from "lucide-react";
import React, { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useCarFiltersStore } from "@/stores/car-filters-store";
import { useCarsStore } from "@/stores/cars-store";

export default function Search(): ReactElement {
  const t = useTranslations("cars");
  const carFilters = useCarFiltersStore((state) => state.carFilters);
  const setCars = useCarsStore((state) => state.setCars);

  const handleSearch = async () => {
    if (carFilters) {
      try {
        const response = await fetch("/api/cars/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carFilters),
        });

        const { data, error } = await response.json();

        if (error) {
          console.log(error);
        }

        if (data && data.length > 0) {
          setCars(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      console.log("No filters selected");
    }
  };

  return (
    <Button onClick={handleSearch} className="cursor-pointer">
      <SearchIcon width="16" height="16" />
      {t("search")}
    </Button>
  );
}
