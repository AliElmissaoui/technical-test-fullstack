import { NextRequest, NextResponse } from "next/server";
import getStripe from "../../../lib/stripe";
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/success`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/cancel`;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: "Visionyze – Premium" },
          unit_amount: 1999,
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "stripe_error" }, { status: 500 });
  }
}
