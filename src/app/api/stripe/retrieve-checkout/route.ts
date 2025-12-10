import Stripe from "stripe";
import { dbFunctions } from "@/db/functions";
import { Tables } from "../../../../../types/database.types";

export const POST = async (req: Request) => {
  const reqData: { carOrder: Tables<"CarOrder"> } = await req.json();

  const stripeSession = await retrieveStripeSession(reqData);

  if (stripeSession.id) {
    const carPayment = await dbFunctions.payment.update(
      {
        expiredAt: new Date(stripeSession.expires_at * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      reqData.carOrder.carId,
      reqData.carOrder.userId,
      reqData.carOrder.sessionId,
    );

    if (carPayment && carPayment.length > 0) {
      const carOrder = await dbFunctions.carOrder.update(
        {
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

  return Response.json({ error: "Error retrieving stripe session" }, { status: 500 });
};

const retrieveStripeSession = async (reqData: { carOrder: Tables<"CarOrder"> }): Promise<Stripe.Checkout.Session> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(reqData.carOrder.sessionId);

  return session;
};
