import Stripe from "stripe";
import { StripeCheckoutData } from "@/interfaces/stripe-checkout-data";
import { dbFunctions } from "@/db/functions";

export const POST = async (req: Request) => {
  const reqData: StripeCheckoutData = await req.json();
  const referer: string = req.headers.get("referer") as string;

  const stripeSession = await createStripeSession(reqData, referer);

  if (stripeSession.id) {
    const carPayment = await dbFunctions.payment.create({
      carId: reqData.carOrder.carId,
      userId: reqData.carOrder.userId,
      sessionId: stripeSession.id,
      amount: reqData.paymentPlan.unit_amount! / 100,
      expiredAt: new Date(stripeSession.expires_at * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (carPayment && carPayment.length > 0) {
      const carOrder = await dbFunctions.carOrder.update(
        {
          sessionId: stripeSession.id,
          expiredAt: new Date(stripeSession.expires_at * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        reqData.carOrder.carId,
        reqData.carOrder.userId,
      );

      if (carOrder && carOrder.length > 0) {
        return Response.json(stripeSession, { status: 200 });
      }
    }
  }

  return Response.json({ error: "Error creating stripe session" }, { status: 500 });
};

const createStripeSession = async (reqData: StripeCheckoutData, referer: string): Promise<Stripe.Checkout.Session> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    submit_type: "pay",
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: reqData.paymentPlan.product.default_price as string,
        quantity: 1,
      },
    ],
    success_url: referer,
    cancel_url: referer,
  });

  return session;
};
