import { RangeFiltersType } from "@/interfaces/range-filter-interface";
import { Enums } from "../../types/database.types";

// OAuth providers (currently disabled - see AUTH_SETUP.md to enable)
export type Provider = "github" | "google";
export const EnabledProviders: Provider[] = [];
export const Providers = [
  {
    key: "github" as Provider,
    name: "Github",
    url: "https://github.com/",
    icon: "/providers/github.png",
  },
  {
    key: "google" as Provider,
    name: "Google",
    url: "https://google.com/",
    icon: "/providers/google.png",
  },
];
export const EngineTypes: Enums<"car_engine_type">[] = ["Combustion", "Electric", "Hybrid"];
export const TransmissionTypes: Enums<"car_transmission_type">[] = ["Automatic", "Manual"];
export const FuelTypes: Enums<"car_fuel_type">[] = ["Diesel", "Petrol", "Hydrogen", "Electricity", "LPG", "Methane"];
export const StatusTypes: Enums<"car_status_type">[] = ["Coming soon", "On sale", "Sold", "In process"];
export const YearRangeTypes: RangeFiltersType = {
  from: 1800,
  to: 2200,
};
export const PriceRangeTypes: RangeFiltersType = {
  from: 0,
  to: Math.pow(10, 6),
};
export const HorsepowerRangeTypes: RangeFiltersType = {
  from: 0,
  to: 2500,
};
export const TorqueRangeTypes: RangeFiltersType = {
  from: 0,
  to: 5000,
};
export const KmRangeTypes: RangeFiltersType = {
  from: 0,
  to: 2 * Math.pow(10, 6),
};
export const KmPerLiterCityRangeTypes: RangeFiltersType = {
  from: 0,
  to: 100,
};
export const KmPerLiterHighwayRangeTypes: RangeFiltersType = {
  from: 0,
  to: 100,
};
