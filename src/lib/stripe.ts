import Stripe from "stripe";

let stripe: Stripe | null = null;

export default function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("Missing STRIPE_SECRET_KEY environment variable");

    stripe = new Stripe(key, {
      apiVersion: "2025-09-30.clover", 
    });
  }
  return stripe;
}
