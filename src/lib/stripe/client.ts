import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY não configurada")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
})

const priceId = process.env.STRIPE_PRO_PRICE_ID ?? process.env.STRIPE_PRICE_ID
if (!priceId) throw new Error("STRIPE_PRO_PRICE_ID não configurada")
export const STRIPE_PRICE_ID = priceId
