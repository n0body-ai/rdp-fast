export const dynamic = 'force-dynamic';
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Webhook signature failed" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Fulfill the order
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;
    const customerId = session.customer as string;

    if (userId) {
      await prisma.subscription.create({
        data: {
          userId: userId,
          stripeSubId: subscriptionId,
          stripeCustomerId: customerId,
          status: "active",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Approx, ideally get from sub object
        },
      });
      console.log(`Subscription active for user ${userId}`);
    }
  }

  // Handle cancellations/updates here later (customer.subscription.deleted)

  return NextResponse.json({ received: true });
}
