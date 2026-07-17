DROP TABLE IF EXISTS spot;

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
  available_start TIMESTAMPTZ,
  available_end TIMESTAMPTZ,
  owner_id UUID
);
