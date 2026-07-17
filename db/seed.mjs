import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
for (const stmt of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
  await sql.query(stmt);
}

const spots = [
  {
    id: "d15b4670-3152-42f6-b67f-5f761b77146b",
    name: "UCSC",
    description: "parking at ucsc",
    addr: "1157 High St",
    lat: 36.9772174,
    lng: -122.0509138,
    price_rate: 10,
    start: "2026-08-01T10:00:00-07:00",
    end: "2026-08-01T12:00:00-07:00",
  },
  {
    id: "2bffb279-9ebf-4b56-8d90-42ecf00ddfb2",
    name: "Soren Old House",
    description: "this spot is owned by frodo, frodo cant rent this spot",
    addr: "1314 River St",
    lat: 36.99116,
    lng: -122.03224,
    price_rate: 30,
    start: "2026-08-01T10:00:00-07:00",
    end: "2026-08-01T12:00:00-07:00",
  },
  {
    id: "017c576f-723e-4e62-9704-6d57b78047d3",
    name: "soren house",
    description: "this spot does not have a rental created for it by default",
    addr: "331 Mission St",
    lat: 36.97621,
    lng: -122.03197,
    price_rate: 15,
    start: "2026-08-01T10:00:00-07:00",
    end: "2026-08-01T12:00:00-07:00",
  },
  {
    id: "80c14ecd-eee9-460e-9924-4bea64d209de",
    name: "a house",
    description: "this spot is available to users like frodo in the future",
    addr: "404 King St",
    lat: 36.97527,
    lng: -122.03595,
    price_rate: 100,
    start: "2026-08-02T10:00:00-07:00",
    end: "2026-08-02T12:00:00-07:00",
  },
];

for (const s of spots) {
  await sql`
    INSERT INTO spot (id, name, description, addr, zipcode, locality, region, country, lat, lng, price_rate, available_start, available_end)
    VALUES (${s.id}, ${s.name}, ${s.description}, ${s.addr}, '95060', 'Santa Cruz', 'California', 'US', ${s.lat}, ${s.lng}, ${s.price_rate}, ${s.start}, ${s.end})
  `;
}

const [{ count }] = await sql`SELECT count(*)::int AS count FROM spot`;
console.log(`Seeded ${count} spots`);
