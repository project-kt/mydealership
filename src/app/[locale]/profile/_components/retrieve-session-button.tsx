"use client";

import { Button } from "@radix-ui/themes";
import axios, { AxiosResponse } from "axios";
import { parseISO } from "date-fns";
import { ReactElement } from "react";
import getStripe from "@/stripe/config";
import { Tables } from "../../../../../types/database.types";

export default function RetrieveSessionButton({ carOrder }: { carOrder: Tables<"CarOrder"> }): ReactElement {
  const handleRetriveSession = async () => {
    if (carOrder.sessionId && carOrder.expiredAt && parseISO(carOrder.expiredAt) > new Date()) {
      const {
        data: checkoutSession,
        status,
        statusText,
      } = await axios.post<any, AxiosResponse<any, { carOrder: Tables<"CarOrder"> }>, { carOrder: Tables<"CarOrder"> }>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/retrieve-checkout`,
        { carOrder: carOrder },
      );

      if (status === 200) {
        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
          sessionId: checkoutSession.id,
        });

        if (error) {
          console.log("Redirect to checkout failed");
        }
      } else {
        console.log(`Error creating stripe session: ${statusText}`);
      }
    }
  };

  return (
    <Button onClick={handleRetriveSession} size="1" variant="soft" className="cursor-pointer">
      Retrieve stripe session
    </Button>
  );
}
