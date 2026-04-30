import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe/client"
import { adminClient } from "@/lib/supabase/admin"

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET não configurada")
}
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

type DbStatus = "active" | "canceled" | "past_due" | "trialing"

function toDbStatus(stripeStatus: string): DbStatus {
  const allowed: DbStatus[] = ["active", "canceled", "past_due", "trialing"]
  return allowed.includes(stripeStatus as DbStatus) ? (stripeStatus as DbStatus) : "canceled"
}

function periodEndISO(subscription: Stripe.Subscription): string | null {
  const epochSeconds = subscription.items?.data[0]?.current_period_end
  if (epochSeconds == null) return null
  return new Date(epochSeconds * 1000).toISOString()
}

async function setWorkspacePlan(
  workspaceId: string,
  plan: "free" | "pro",
  fields: Partial<{
    stripe_subscription_id: string
    stripe_customer_id: string
    status: DbStatus
    current_period_end: string | null
  }> = {}
) {
  const { error: upsertError } = await adminClient
    .from("subscriptions")
    .upsert(
      { workspace_id: workspaceId, plan, ...fields },
      { onConflict: "workspace_id" }
    )
  if (upsertError) throw new Error(`[setWorkspacePlan] upsert failed: ${upsertError.message}`)

  const { error: updateError } = await adminClient
    .from("workspaces")
    .update({ plan })
    .eq("id", workspaceId)
  if (updateError) throw new Error(`[setWorkspacePlan] workspace update failed: ${updateError.message}`)
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription" || !session.subscription) return

  const workspaceId = session.metadata?.workspace_id
  if (!workspaceId) {
    console.error("[stripe-webhook] workspace_id ausente na checkout session:", session.id)
    return
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

  // Valida que o customer da subscription bate com o workspace antes de sobrescrever
  const { data: existingSub } = await adminClient
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("workspace_id", workspaceId)
    .maybeSingle()

  if (
    existingSub?.stripe_customer_id &&
    existingSub.stripe_customer_id !== (subscription.customer as string)
  ) {
    console.error(
      "[stripe-webhook] customer_id divergente para workspace:",
      workspaceId,
      "esperado:",
      existingSub.stripe_customer_id,
      "recebido:",
      subscription.customer
    )
    return
  }

  if (!subscription.metadata?.workspace_id) {
    await stripe.subscriptions.update(subscription.id, {
      metadata: { workspace_id: workspaceId },
    })
  }

  await setWorkspacePlan(workspaceId, "pro", {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    status: toDbStatus(subscription.status),
    current_period_end: periodEndISO(subscription),
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspace_id
  if (!workspaceId) {
    console.error("[stripe-webhook] workspace_id ausente na subscription deletada:", subscription.id)
    return
  }

  await setWorkspacePlan(workspaceId, "free", {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    status: toDbStatus(subscription.status),
    current_period_end: periodEndISO(subscription),
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const workspaceId = subscription.metadata?.workspace_id
  if (!workspaceId) return

  const plan = subscription.status === "active" ? "pro" : "free"
  await setWorkspacePlan(workspaceId, plan, {
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    status: toDbStatus(subscription.status),
    current_period_end: periodEndISO(subscription),
  })
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const parent = invoice.parent
  const subscriptionId =
    parent?.type === "subscription_details" && parent.subscription_details?.subscription
      ? typeof parent.subscription_details.subscription === "string"
        ? parent.subscription_details.subscription
        : parent.subscription_details.subscription.id
      : null

  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const workspaceId = subscription.metadata?.workspace_id
  if (!workspaceId) return

  const { error } = await adminClient
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("workspace_id", workspaceId)
  if (error) throw new Error(`[handlePaymentFailed] update failed: ${error.message}`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const parent = invoice.parent
  const subscriptionId =
    parent?.type === "subscription_details" && parent.subscription_details?.subscription
      ? typeof parent.subscription_details.subscription === "string"
        ? parent.subscription_details.subscription
        : parent.subscription_details.subscription.id
      : null

  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const workspaceId = subscription.metadata?.workspace_id
  if (!workspaceId) return

  const { error } = await adminClient
    .from("subscriptions")
    .update({ status: "active" })
    .eq("workspace_id", workspaceId)
  if (error) throw new Error(`[handlePaymentSucceeded] update failed: ${error.message}`)
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

  // Idempotência: ignora eventos já processados
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = adminClient as any
  const { data: processed } = await db
    .from("stripe_events")
    .select("id")
    .eq("id", event.id)
    .maybeSingle()

  if (processed) {
    return NextResponse.json({ received: true })
  }

  const { error: insertEventError } = await db
    .from("stripe_events")
    .insert({ id: event.id })

  if (insertEventError) {
    // Corrida entre dois requests simultâneos — o outro já inseriu, ignorar
    if (insertEventError.code === "23505") {
      return NextResponse.json({ received: true })
    }
    console.error("[stripe-webhook] Erro ao registrar evento:", insertEventError)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case "invoice.paid":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
    }
  } catch (err) {
    console.error(`[stripe-webhook] Erro ao processar ${event.type}:`, err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
