import Link from "next/link";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth";
import Header from "@/components/Header";
import { priceLabel } from "@/lib/price";
import { deleteSpot } from "@/app/spots/actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  addr: string | null;
  locality: string | null;
  price_rate: string;
  price_unit: "hour" | "day";
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

export default async function MySpotsPage() {
  const userId = await getUserId();
  if (!userId) redirect("/login");

  const spots = (await sql`
    SELECT id, name, addr, locality, price_rate, price_unit,
           available_start, available_end
    FROM spot WHERE owner_id = ${userId} ORDER BY name
  `) as Row[];

  return (
    <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "1rem" }}>
      <Header />
      <h1>My spots</h1>
      {spots.length === 0 ? (
        <p>
          <Link href="/spots/new">List your first spot</Link>
        </p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {spots.map((spot) => {
            const start = fmt(spot.available_start);
            const end = fmt(spot.available_end);
            const availability =
              start && end
                ? `Available ${start} to ${end}`
                : start
                  ? `Available from ${start}`
                  : end
                    ? `Available until ${end}`
                    : null;
            return (
              <li key={spot.id} style={{ marginBottom: "1rem" }}>
                <Link href={`/spots/${spot.id}`}>{spot.name}</Link>{" "}
                <strong>{priceLabel(spot)}</strong>
                <br />
                {[spot.addr, spot.locality].filter(Boolean).join(", ")}
                {availability && (
                  <>
                    <br />
                    {availability}
                  </>
                )}
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <Link href={`/spots/${spot.id}/edit`}>Edit</Link>
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      await deleteSpot(formData);
                    }}
                  >
                    <input type="hidden" name="id" value={spot.id} />
                    <button type="submit">Delete</button>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
