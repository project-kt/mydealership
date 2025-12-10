import { query } from "./config";
import { Tables } from "../../types/database.types";
import { CarFiltersType } from "../interfaces/car-filters-interface";

export const dbFunctions = {
  car: {
    search: async (carFilters: CarFiltersType) => {
      try {
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
        return { data: result.rows, error: null };
      } catch (error) {
        console.error("Error searching cars:", error);
        return { data: null, error };
      }
    },
  },
  carOrder: {
    get: async (carId?: number, userId?: string) => {
      try {
        let queryText = 'SELECT * FROM "CarOrder" WHERE 1=1';
        const params: any[] = [];
        let paramCount = 1;

        if (userId) {
          queryText += ` AND "userId" = $${paramCount}`;
          params.push(userId);
          paramCount++;
        }
        if (carId) {
          queryText += ` AND "carId" = $${paramCount}`;
          params.push(carId);
          paramCount++;
        }

        const result = await query(queryText, params);
        return result.rows;
      } catch (error) {
        console.error("Error fetching car orders:", error);
        return null;
      }
    },
    create: async (newCarOrder: { carId: number; userId: string; price: number } & Partial<Tables<"CarOrder">>) => {
      try {
        const columns = Object.keys(newCarOrder)
          .map((key) => `"${key}"`)
          .join(", ");
        const values = Object.values(newCarOrder);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const queryText = `INSERT INTO "CarOrder" (${columns}) VALUES (${placeholders}) RETURNING *`;
        const result = await query(queryText, values);
        return result.rows;
      } catch (error) {
        console.error("Error creating car order:", error);
        return null;
      }
    },
    update: async (newCarOrder: Partial<Tables<"CarOrder">>, carId: number, userId: string) => {
      try {
        const entries = Object.entries(newCarOrder);
        const setClause = entries.map(([key, _], i) => `"${key}" = $${i + 1}`).join(", ");
        const values = [...entries.map(([_, value]) => value), carId, userId];

        const queryText = `
          UPDATE "CarOrder"
          SET ${setClause}
          WHERE "carId" = $${entries.length + 1} AND "userId" = $${entries.length + 2}
          RETURNING *
        `;
        const result = await query(queryText, values);
        return result.rows;
      } catch (error) {
        console.error("Error updating car order:", error);
        return null;
      }
    },
    updateBySessionId: async (newCarOrder: Partial<Tables<"CarOrder">>, sessionId: string) => {
      try {
        const entries = Object.entries(newCarOrder);
        const setClause = entries.map(([key, _], i) => `"${key}" = $${i + 1}`).join(", ");
        const values = [...entries.map(([_, value]) => value), sessionId];

        const queryText = `
          UPDATE "CarOrder"
          SET ${setClause}
          WHERE "sessionId" = $${entries.length + 1}
        `;
        await query(queryText, values);
        return null;
      } catch (error) {
        console.error("Error updating car order by session:", error);
        return error;
      }
    },
  },
  payment: {
    create: async (
      newPayment: { carId: number; userId: string; amount: number; updatedAt: string } & Partial<Tables<"Payment">>,
    ) => {
      try {
        const columns = Object.keys(newPayment)
          .map((key) => `"${key}"`)
          .join(", ");
        const values = Object.values(newPayment);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

        const queryText = `INSERT INTO "Payment" (${columns}) VALUES (${placeholders}) RETURNING *`;
        const result = await query(queryText, values);
        return result.rows;
      } catch (error) {
        console.error("Error creating payment:", error);
        return null;
      }
    },
    update: async (newPayment: Partial<Tables<"Payment">>, carId: number, userId: string, sessionId: string) => {
      try {
        const entries = Object.entries(newPayment);
        const setClause = entries.map(([key, _], i) => `"${key}" = $${i + 1}`).join(", ");
        const values = [...entries.map(([_, value]) => value), carId, userId, sessionId];

        const queryText = `
          UPDATE "Payment"
          SET ${setClause}
          WHERE "carId" = $${entries.length + 1}
            AND "userId" = $${entries.length + 2}
            AND "sessionId" = $${entries.length + 3}
          RETURNING *
        `;
        const result = await query(queryText, values);
        return result.rows;
      } catch (error) {
        console.error("Error updating payment:", error);
        return null;
      }
    },
    updateBySessionId: async (newPayment: Partial<Tables<"Payment">>, sessionId: string) => {
      try {
        const entries = Object.entries(newPayment);
        const setClause = entries.map(([key, _], i) => `"${key}" = $${i + 1}`).join(", ");
        const values = [...entries.map(([_, value]) => value), sessionId];

        const queryText = `
          UPDATE "Payment"
          SET ${setClause}
          WHERE "sessionId" = $${entries.length + 1}
        `;
        await query(queryText, values);
        return null;
      } catch (error) {
        console.error("Error updating payment by session:", error);
        return error;
      }
    },
  },
};
