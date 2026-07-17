import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth";
import Header from "@/components/Header";
import SpotForm from "@/components/SpotForm";
import { createSpot } from "@/app/spots/actions";

export const dynamic = "force-dynamic";

export default async function NewSpotPage() {
  if (!(await getUserId())) redirect("/login");

  return (
    <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "1rem" }}>
      <Header />
      <h1>New spot</h1>
      <SpotForm action={createSpot} />
    </main>
  );
}
