-- Adiciona UNIQUE constraints em subscriptions para prevenir duplicatas de customer/subscription Stripe
-- Protege contra race conditions em getOrCreateCustomer e eventos duplicados de webhook

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_stripe_customer_id_key
  UNIQUE (stripe_customer_id);

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_stripe_subscription_id_key
  UNIQUE (stripe_subscription_id);
