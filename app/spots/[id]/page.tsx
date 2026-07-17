import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import SpotMap, { type Spot } from "@/components/SpotMap";
import { priceLabel } from "@/lib/price";

export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type SpotDetail = Spot & {
  description: string | null;
  zipcode: string | null;
  region: string | null;
  country: string | null;
  available_start: string | Date | null;
  available_end: string | Date | null;
};

const fmt = (v: string | Date | null) =>
  v &&
  new Date(v).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Los_Angeles",
  });

export default async function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const rows = (await sql`
    SELECT * FROM spot WHERE id = ${id}
  `) as SpotDetail[];
  const spot = rows[0];
  if (!spot) notFound();

  const address = [
    spot.addr,
    spot.locality,
    spot.region,
    spot.zipcode,
    spot.country,
  ]
    .filter(Boolean)
    .join(", ");
  const start = fmt(spot.available_start);
  const end = fmt(spot.available_end);
  const availability =
    start && end
      ? `Available ${start} to ${end}`
      : start
        ? `Available from ${start}`
        : end
          ? `Available until ${end}`
          : "Availability not listed";

  return (
    <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "1rem" }}>
      <p>
        <Link href="/">&larr; Back to map</Link>
      </p>
      <h1>{spot.name}</h1>
      {spot.description && <p>{spot.description}</p>}
      <p>{address}</p>
      <p>{availability}</p>
      <p>
        <strong>{priceLabel(spot)}</strong>
      </p>
      <div style={{ height: "20rem" }}>
        <SpotMap center={[spot.lat, spot.lng]} zoom={16} spots={[spot]} />
      </div>
    </main>
  );
}
