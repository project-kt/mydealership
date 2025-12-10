import { headers } from "next/headers";
import Stripe from "stripe";
import { dbFunctions } from "@/db/functions";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  if (req.body) {
    try {
      const signature = headers().get("stripe-signature");
      const bodyBuffer = await req.text();
      const event: Stripe.Event = stripe.webhooks.constructEvent(bodyBuffer, signature!, webhookSecret);

      switch (event.type) {
        case "checkout.session.completed":
          const checkoutSession = event.data.object;

          let error: any = null;

          error = await dbFunctions.payment.updateBySessionId(
            {
              method: checkoutSession.payment_method_types[0],
              status: checkoutSession.payment_status,
              updatedAt: new Date().toISOString(),
              expiredAt: new Date(checkoutSession.expires_at * 1000).toISOString(),
              currency: checkoutSession.currency ?? "",
              customerEmail: checkoutSession.customer_details?.email ?? "",
              country: checkoutSession.customer_details?.address?.country ?? "",
              phone: checkoutSession.customer_details?.phone ?? "",
            },
            checkoutSession.id,
          );

          error = await dbFunctions.carOrder.updateBySessionId(
            {
              status: checkoutSession.status ?? "open",
              updatedAt: new Date().toISOString(),
            },
            checkoutSession.id,
          );

          if (error) {
            return Response.json({ error: error.message }, { status: 500 });
          }

          break;
        default:
          return Response.json({ error: `Unhandled event type ${event.type}` }, { status: 400 });
      }
    } catch (error) {
      return Response.json({ error: `Webhook Error: ${error}` }, { status: 400 });
    }
  }

  return Response.json({ received: true });
}
