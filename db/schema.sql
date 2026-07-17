DROP TABLE IF EXISTS spot;
DROP TABLE IF EXISTS account;

CREATE TABLE account (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE spot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  addr TEXT,
  zipcode TEXT,
  locality TEXT,
  region TEXT,
  country TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  price_rate NUMERIC NOT NULL,
  price_unit TEXT NOT NULL DEFAULT 'hour' CHECK (price_unit IN ('hour', 'day')),
  available_start TIMESTAMPTZ,
  available_end TIMESTAMPTZ,
  owner_id UUID,
  FOREIGN KEY (owner_id) REFERENCES account(id) ON DELETE CASCADE
);
