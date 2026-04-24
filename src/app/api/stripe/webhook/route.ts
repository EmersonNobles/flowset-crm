import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe/client"
import { adminClient } from "@/lib/supabase/admin"

// Importante: o body deve chegar como raw buffer para verificação de assinatura.
// O Next.js App Router não aplica body parser nesta rota, então está correto.
export const dynamic = "force-dynamic"

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

async function syncSubscription(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspace_id
  if (!workspaceId) {
    console.error("[stripe-webhook] workspace_id ausente na subscription:", subscription.id)
    return
  }

  const isActive = subscription.status === "active" || subscription.status === "trialing"
  const plan = isActive ? "pro" : "free"
  const currentPeriodEnd = new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString()

  await adminClient
    .from("subscriptions")
    .upsert(
      {
        workspace_id: workspaceId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        plan,
        status: subscription.status,
        current_period_end: currentPeriodEnd,
      },
      { onConflict: "workspace_id" }
    )

  await adminClient
    .from("workspaces")
    .update({ plan })
    .eq("id", workspaceId)
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription" || !session.subscription) return

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  // Garante que o metadata do workspace chegue pela session quando não está na subscription
  if (!subscription.metadata?.workspace_id && session.metadata?.workspace_id) {
    await stripe.subscriptions.update(subscription.id, {
      metadata: { workspace_id: session.metadata.workspace_id },
    })
    subscription.metadata = { workspace_id: session.metadata.workspace_id }
  }

  await syncSubscription(subscription)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    console.error("[stripe-webhook] Assinatura inválida:", err)
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object as Stripe.Subscription)
        break

      default:
        // Ignorar eventos não tratados sem erro
        break
    }
  } catch (err) {
    console.error(`[stripe-webhook] Erro ao processar ${event.type}:`, err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
