-- Tabela de idempotência para eventos do webhook Stripe
-- Garante que cada event.id seja processado exatamente uma vez
CREATE TABLE IF NOT EXISTS stripe_events (
  id          text        PRIMARY KEY,
  processed_at timestamptz NOT NULL DEFAULT now()
);

-- Apenas o service_role pode inserir/ler (webhook usa adminClient)
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- Nenhum usuário autenticado acessa esta tabela diretamente
CREATE POLICY "no access for authenticated users"
  ON stripe_events
  FOR ALL
  TO authenticated
  USING (false);
