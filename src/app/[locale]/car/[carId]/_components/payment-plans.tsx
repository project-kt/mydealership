"use client";

import axios from "axios";
import { ReactElement, useEffect, useState } from "react";
import { memo } from "react";
import { Heading, Text } from "@radix-ui/themes";
import { StripePaymentPlan } from "@/app/api/stripe/payment-plans/route";
import PaymentPlan from "./payment-plan";
import { Tables } from "../../../../../../types/database.types";

type PaymentPlansProps = {
  car: Tables<"Car">;
  carOrder: Tables<"CarOrder"> | null;
};

const PaymentPlans = ({ car, carOrder }: PaymentPlansProps): ReactElement | undefined => {
  const [paymentPlans, setPaymentPlans] = useState<StripePaymentPlan[]>([]);

  const getPaymentPlans = async () => {
    const { data }: { data: StripePaymentPlan[] } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/payment-plans`,
    );

    if (data && data.length > 0) {
      setPaymentPlans(data);
    }
  };

  useEffect(() => {
    getPaymentPlans();
  }, []);

  if (paymentPlans.length > 0) {
    return (
      <div className="py-16">
        <div className="mb-5 text-center">
          <Heading size="8" as="h1" className="mb-3">
            Discover our plans
          </Heading>
          <Text as="p" color="gray">
            Filters plans
          </Text>
        </div>
        <div className="justify-center gap-4 md:flex">
          {paymentPlans.map((paymentPlan, index) => (
            <PaymentPlan key={index} car={car} carOrder={carOrder} paymentPlan={paymentPlan} />
          ))}
        </div>
      </div>
    );
  }
};

export default memo(PaymentPlans);
