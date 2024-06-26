"use client";

import { Slider } from "@radix-ui/themes";
import React, { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { useCarFiltersStore } from "@/stores/car-filters-store";
import { HorsepowerRangeTypes } from "@/utils/constants";

export default function HorsepowerFilter(): ReactElement {
  const t = useTranslations("cars");
  const { horsepower, setHorsepower } = useCarFiltersStore((state) => ({
    horsepower: state.carFilters?.horsepower,
    setHorsepower: state.setCarFilterHorsepowerRange,
  }));

  const handleRangeChange = (values: number[]) => {
    setHorsepower({
      from: values[0],
      to: values[1],
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div>{`${t("horsepower")} ${horsepower ? horsepower.from : HorsepowerRangeTypes.from} - ${horsepower ? horsepower.to : HorsepowerRangeTypes.to}`}</div>
      <Slider
        min={HorsepowerRangeTypes.from}
        max={HorsepowerRangeTypes.to}
        defaultValue={[HorsepowerRangeTypes.from, HorsepowerRangeTypes.to]}
        onValueCommit={handleRangeChange}
        className="w-full"
      />
    </div>
  );
}
