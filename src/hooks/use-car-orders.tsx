import { useEffect, useState } from "react";
import { useUserSessionStore } from "@/stores/session-store";
import { dbFunctions } from "@/db/functions";
import { Enums, Tables } from "../../types/database.types";

export default function useCarOrders(carId?: number): Tables<"CarOrder">[] {
  const user = useUserSessionStore((state) => state.user);
  const [carOrders, setCarOrders] = useState<Tables<"CarOrder">[]>([]);

  useEffect(() => {
    getCarOrders();
  }, [user]);

  const getCarOrders = async () => {
    if (user) {
      const carOrders = await dbFunctions.carOrder.get(carId, user.id);

      if (carOrders && carOrders.length > 0) {
        setCarOrders(verifiedCarOrders(carOrders));
      }
    }
  };

  return carOrders;
}

const verifiedCarOrders = (carOrders: Tables<"CarOrder">[]): Tables<"CarOrder">[] => {
  const carStatus: Enums<"car_order_status_type"> = "expired";

  const verifiedCarOrders = carOrders.map((carOrder: Tables<"CarOrder">) => {
    if (isCarOrderExpired(carOrder)) {
      dbFunctions.carOrder.update(
        {
          status: "expired",
        },
        carOrder.carId,
        carOrder.userId,
      );

      return { ...carOrder, status: carStatus };
    }
    return carOrder;
  });

  return verifiedCarOrders;
};

const isCarOrderExpired = (carOrder: Tables<"CarOrder">): boolean => {
  if (!carOrder.expiredAt) {
    return false;
  }
  return new Date(carOrder.expiredAt) < new Date();
};
