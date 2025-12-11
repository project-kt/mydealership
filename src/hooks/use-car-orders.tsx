import { useEffect, useState } from "react";
import axios from "axios";
import { useUserSessionStore } from "@/stores/session-store";
import { Enums, Tables } from "../../types/database.types";

export default function useCarOrders(carId?: number): Tables<"CarOrder">[] {
  const user = useUserSessionStore((state) => state.user);
  const [carOrders, setCarOrders] = useState<Tables<"CarOrder">[]>([]);

  useEffect(() => {
    getCarOrders();
  }, [user]);

  const getCarOrders = async () => {
    if (user) {
      const params = new URLSearchParams();
      if (carId) params.append("carId", carId.toString());
      params.append("userId", user.id);

      const response = await axios.get<Tables<"CarOrder">[]>(`/api/car-orders?${params.toString()}`);

      if (response.data && response.data.length > 0) {
        setCarOrders(verifiedCarOrders(response.data));
      }
    }
  };

  return carOrders;
}

const verifiedCarOrders = (carOrders: Tables<"CarOrder">[]): Tables<"CarOrder">[] => {
  const carStatus: Enums<"car_order_status_type"> = "expired";

  const verifiedCarOrders = carOrders.map((carOrder: Tables<"CarOrder">) => {
    if (isCarOrderExpired(carOrder)) {
      // Update via API
      axios.patch("/api/car-orders", {
        fieldsToUpdate: { status: "expired" },
        carId: carOrder.carId,
        userId: carOrder.userId,
      });

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
