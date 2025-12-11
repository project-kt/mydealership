import { Button, Callout, Card, Flex, Link, Text } from "@radix-ui/themes";
import axios, { AxiosResponse } from "axios";
import { ReactElement, useState } from "react";
import Stripe from "stripe";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { StripePaymentPlan } from "@/app/api/stripe/payment-plans/route";
import { StripeCheckoutData } from "@/interfaces/stripe-checkout-data";
import { useUserSessionStore } from "@/stores/session-store";
import getStripe from "@/stripe/config";
import { Tables } from "../../../../../../types/database.types";

type PaymentPlanProps = {
  car: Tables<"Car">;
  carOrder: Tables<"CarOrder"> | null;
  paymentPlan: StripePaymentPlan;
};

const PaymentPlan = ({ car, carOrder, paymentPlan }: PaymentPlanProps): ReactElement => {
  const t = useTranslations("car");
  const user = useUserSessionStore((state) => state.user);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newCarOrder, setNewCarOrder] = useState<Tables<"CarOrder"> | null>(null);

  const handleBuyPlan = async () => {
    let result;

    if (carOrder) {
      const fieldsToUpdate: Partial<Tables<"CarOrder">> = {
        status: "open",
        plan: paymentPlan.product.name,
        price: paymentPlan.unit_amount! / 100,
        expiredAt: null,
        updatedAt: new Date().toISOString(),
      };

      const response = await axios.patch<Tables<"CarOrder">>("/api/car-orders", {
        fieldsToUpdate,
        carId: car.carId,
        userId: user!.id,
      });

      result = response.data;
    } else {
      const newCarOrder: { carId: number; userId: string; price: number } & Partial<Tables<"CarOrder">> = {
        carId: car.carId,
        userId: user!.id,
        plan: paymentPlan.product.name,
        price: paymentPlan.unit_amount! / 100,
        expiredAt: null,
      };

      const response = await axios.post<Tables<"CarOrder">>("/api/car-orders", newCarOrder);
      result = response.data;
    }

    if (result) {
      console.log("OPEN MODAL");
      setNewCarOrder(result);
      setIsOpen(true);
    }
  };

  const handleClickOrdersPage = () => {
    redirect("/orders");
  };

  const handleBuyNow = async () => {
    if (user) {
      const stripeCheckoutData: StripeCheckoutData = {
        carOrder: newCarOrder!,
        paymentPlan: paymentPlan,
      };
      const {
        data: checkoutSession,
        status,
        statusText,
      } = await axios.post<
        Stripe.Checkout.Session,
        AxiosResponse<Stripe.Checkout.Session, StripeCheckoutData>,
        StripeCheckoutData
      >(`${process.env.NEXT_PUBLIC_API_URL}/api/stripe/create-checkout`, stripeCheckoutData);

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
    <div className="w-full">
      <Card className="flex flex-col gap-3 text-center">
        <Flex gap="3" direction="column">
          <Text as="div" size="5" weight="bold">
            {paymentPlan.product.name}
          </Text>
          <Button key={paymentPlan.id} value={paymentPlan.id} onClick={handleBuyPlan} className="w-full cursor-pointer">
            {t("payment_plans.buy_now")}
          </Button>
          {isOpen && (
            <Callout.Root className="mt-3">
              <Callout.Text>
                {t("payment_plans.order_created")}
                <div className="flex flex-wrap gap-x-3">
                  <Link onClick={handleClickOrdersPage}>{t("payment_plans.visit_orders")}</Link>
                  <Link onClick={handleBuyNow}>{t("payment_plans.proced_to_payment")}</Link>
                </div>
              </Callout.Text>
            </Callout.Root>
          )}
        </Flex>
      </Card>
    </div>
  );
};

export default PaymentPlan;
