"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { adminClient } from "@/lib/supabase/admin"
import { stripe, STRIPE_PRICE_ID } from "@/lib/stripe/client"
import { getUserWorkspaces, getActiveWorkspaceId } from "@/lib/supabase/workspace"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

async function getAuthContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const workspaces = await getUserWorkspaces()
  const workspaceId = getActiveWorkspaceId(workspaces)
  if (!workspaceId) redirect("/onboarding/workspace")

  return { user, workspaceId }
}

/** Garante que exista um Stripe Customer para o workspace e retorna o ID. */
async function getOrCreateCustomer(workspaceId: string, email: string): Promise<string> {
  const { data: sub } = await adminClient
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("workspace_id", workspaceId)
    .maybeSingle()

  if (sub?.stripe_customer_id) return sub.stripe_customer_id

  const customer = await stripe.customers.create({
    email,
    metadata: { workspace_id: workspaceId },
  })

  await adminClient
    .from("subscriptions")
    .upsert(
      { workspace_id: workspaceId, stripe_customer_id: customer.id, plan: "free", status: "inactive" },
      { onConflict: "workspace_id" }
    )

  return customer.id
}

export async function createCheckoutSession() {
  const { user, workspaceId } = await getAuthContext()

  const customerId = await getOrCreateCustomer(workspaceId, user.email!)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${APP_URL}/settings/billing?success=1`,
    cancel_url: `${APP_URL}/settings/billing?canceled=1`,
    metadata: { workspace_id: workspaceId },
    subscription_data: {
      metadata: { workspace_id: workspaceId },
    },
    allow_promotion_codes: true,
  })

  if (!session.url) throw new Error("Falha ao criar sessão de checkout")
  redirect(session.url)
}

export async function createPortalSession() {
  const { workspaceId } = await getAuthContext()

  const { data: sub } = await adminClient
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("workspace_id", workspaceId)
    .maybeSingle()

  if (!sub?.stripe_customer_id) {
    redirect("/settings/billing?error=no_subscription")
  }

  const customerId = sub.stripe_customer_id

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/settings/billing`,
  })

  redirect(portalSession.url)
}
