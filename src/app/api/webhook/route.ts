import { NextRequest, NextResponse } from "next/server";
import getStripe from "../../../lib/stripe";
import prisma from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    await prisma.payment.upsert({
      where: { stripeSessionId: session.id },
      update: {},
      create: {
        stripeSessionId: session.id,
        amount: session.amount_total ?? 0,
        currency: session.currency ?? "eur",
        status: session.payment_status ?? "unknown",
        customerEmail: session.customer_email ?? null,
      },
    });
  }

  return NextResponse.json({ received: true });
}
