CREATE TABLE IF NOT EXISTS subscriptions (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id            uuid        NOT NULL UNIQUE REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_customer_id      text,
  stripe_subscription_id  text,
  plan                    text        NOT NULL DEFAULT 'free',
  status                  text        NOT NULL DEFAULT 'active',
  current_period_end      timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_plan_check   CHECK (plan   IN ('free', 'pro')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'canceled', 'past_due', 'trialing'))
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace_id           ON subscriptions (workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id     ON subscriptions (stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions (stripe_subscription_id);
