import { sql } from "@/lib/db";

export async function GET() {
  const spots = await sql`SELECT * FROM spot ORDER BY name`;
  return Response.json(spots);
}
