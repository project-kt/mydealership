import { NextRequest, NextResponse } from "next/server";
import { dbFunctions } from "@/db/functions";
import { Tables } from "../../../../types/database.types";

// GET /api/car-orders - Get car orders
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const carId = searchParams.get("carId");
    const userId = searchParams.get("userId");

    const carOrders = await dbFunctions.carOrder.get(carId ? parseInt(carId) : undefined, userId || undefined);

    return NextResponse.json(carOrders, { status: 200 });
  } catch (error) {
    console.error("Error fetching car orders:", error);
    return NextResponse.json({ error: "Failed to fetch car orders" }, { status: 500 });
  }
}

// POST /api/car-orders - Create a car order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCarOrder: { carId: number; userId: string; price: number } & Partial<Tables<"CarOrder">> = body;

    const result = await dbFunctions.carOrder.create(newCarOrder);

    if (result && result.length > 0) {
      return NextResponse.json(result[0], { status: 201 });
    }

    return NextResponse.json({ error: "Failed to create car order" }, { status: 500 });
  } catch (error) {
    console.error("Error creating car order:", error);
    return NextResponse.json({ error: "Failed to create car order" }, { status: 500 });
  }
}

// PATCH /api/car-orders - Update a car order
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { fieldsToUpdate, carId, userId } = body;

    const result = await dbFunctions.carOrder.update(fieldsToUpdate, carId, userId);

    if (result && result.length > 0) {
      return NextResponse.json(result[0], { status: 200 });
    }

    return NextResponse.json({ error: "Failed to update car order" }, { status: 500 });
  } catch (error) {
    console.error("Error updating car order:", error);
    return NextResponse.json({ error: "Failed to update car order" }, { status: 500 });
  }
}
