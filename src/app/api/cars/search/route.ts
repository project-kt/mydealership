import { NextRequest, NextResponse } from "next/server";
import { query } from "@/db/config";
import { CarFiltersType } from "@/interfaces/car-filters-interface";
import { Tables } from "../../../../../types/database.types";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const searchQuery = searchParams.get("q");

    if (!searchQuery || searchQuery.trim().length === 0) {
      return NextResponse.json({ cars: [] });
    }

    const result = await query('SELECT * FROM "Car" WHERE "title" ILIKE $1 LIMIT 10', [`%${searchQuery}%`]);

    return NextResponse.json({ cars: result.rows });
  } catch (error) {
    console.error("Error searching cars:", error);
    return NextResponse.json({ error: "Failed to search cars" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const carFilters: CarFiltersType = await req.json();

    let queryText = 'SELECT * FROM "Car" WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (carFilters.title && carFilters.title.length > 0) {
      queryText += ` AND "title" ILIKE $${paramCount}`;
      params.push(`%${carFilters.title}%`);
      paramCount++;
    }
    if (carFilters.manufacturer && carFilters.manufacturer > 0) {
      queryText += ` AND "manufacturerId" = $${paramCount}`;
      params.push(carFilters.manufacturer);
      paramCount++;
    }
    if (carFilters.model && carFilters.model > 0) {
      queryText += ` AND "modelId" = $${paramCount}`;
      params.push(carFilters.model);
      paramCount++;
    }
    if (carFilters.engineType && carFilters.engineType.length > 0) {
      queryText += ` AND "engineType" = $${paramCount}`;
      params.push(carFilters.engineType);
      paramCount++;
    }
    if (carFilters.fuelType && carFilters.fuelType.length > 0) {
      queryText += ` AND "fuelType" = $${paramCount}`;
      params.push(carFilters.fuelType);
      paramCount++;
    }
    if (carFilters.transmissionType && carFilters.transmissionType.length > 0) {
      queryText += ` AND "transmissionType" = $${paramCount}`;
      params.push(carFilters.transmissionType);
      paramCount++;
    }
    if (carFilters.status && carFilters.status.length > 0) {
      queryText += ` AND "status" = $${paramCount}`;
      params.push(carFilters.status);
      paramCount++;
    }
    if (carFilters.category && carFilters.category > 0) {
      queryText += ` AND "categoryId" = $${paramCount}`;
      params.push(carFilters.category);
      paramCount++;
    }
    if (carFilters.price) {
      queryText += ` AND "price" >= $${paramCount} AND "price" <= $${paramCount + 1}`;
      params.push(carFilters.price.from, carFilters.price.to);
      paramCount += 2;
    }
    if (carFilters.torque) {
      queryText += ` AND "torque" >= $${paramCount} AND "torque" <= $${paramCount + 1}`;
      params.push(carFilters.torque.from, carFilters.torque.to);
      paramCount += 2;
    }
    if (carFilters.horsepower) {
      queryText += ` AND "horsepower" >= $${paramCount} AND "horsepower" <= $${paramCount + 1}`;
      params.push(carFilters.horsepower.from, carFilters.horsepower.to);
      paramCount += 2;
    }
    if (carFilters.km) {
      queryText += ` AND "km" >= $${paramCount} AND "km" <= $${paramCount + 1}`;
      params.push(carFilters.km.from, carFilters.km.to);
      paramCount += 2;
    }
    if (carFilters.kmPerLiterCity) {
      queryText += ` AND "kmPerLiterCity" >= $${paramCount} AND "kmPerLiterCity" <= $${paramCount + 1}`;
      params.push(carFilters.kmPerLiterCity.from, carFilters.kmPerLiterCity.to);
      paramCount += 2;
    }
    if (carFilters.kmPerLiterHighway) {
      queryText += ` AND "kmPerLiterHighway" >= $${paramCount} AND "kmPerLiterHighway" <= $${paramCount + 1}`;
      params.push(carFilters.kmPerLiterHighway.from, carFilters.kmPerLiterHighway.to);
      paramCount += 2;
    }

    const result = await query<Tables<"Car">>(queryText, params);
    return NextResponse.json({ data: result.rows, error: null });
  } catch (error) {
    console.error("Error searching cars:", error);
    return NextResponse.json({ data: null, error: "Failed to search cars" }, { status: 500 });
  }
}
