"use client";

import { useRouter } from "next/navigation";
import { StylesConfig } from "react-select";
import AsyncSelect from "react-select/async";
import { useTranslations } from "next-intl";
import { useCarFiltersStore } from "@/stores/car-filters-store";
import { Tables } from "../../../types/database.types";

const SinglelineCars = () => {
  const t = useTranslations("index");
  const router = useRouter();
  const setTitle = useCarFiltersStore((state) => state.setCarFilterTitle);

  const loadCars = async (input: string) => {
    try {
      const response = await fetch(`/api/cars/search?q=${encodeURIComponent(input)}`);
      if (!response.ok) {
        console.error("Failed to search cars");
        return [];
      }
      const data = await response.json();
      return data.cars || [];
    } catch (error) {
      console.error("Error searching cars:", error);
      return [];
    }
  };

  const colourStyles: StylesConfig<Tables<"Car">> = {
    control: (styles) => ({
      ...styles,
      ":hover": { borderColor: "#a3e635" },
      boxShadow: "0 0 1px #a3e635",
    }),
    option: (styles) => ({
      ...styles,
      ":hover": { backgroundColor: "#ecfccb" },
    }),
  };

  return (
    <div>
      <AsyncSelect<Tables<"Car">>
        placeholder={t("searchButton")}
        styles={colourStyles}
        cacheOptions={true}
        defaultOptions={true}
        loadOptions={loadCars}
        formatOptionLabel={(car) => {
          return (
            <div key={car.carId} id={car.carId.toString()} className="flex items-center space-x-2">
              <img src={car.images[0]} alt={car.title} className="aspect-auto h-10" />
              <div>{car.title}</div>
            </div>
          );
        }}
        onChange={(selectedCar) => {
          router.push(`/car/${selectedCar?.carId}`, { scroll: false });
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();

            setTitle((event.target as HTMLInputElement).value);
            router.push("cars", { scroll: false });
          }
        }}
      />
    </div>
  );
};

export default SinglelineCars;
