import { redirect } from "next/navigation";

export default function Home() {
  // Direct Launch into Club Main System
  redirect("/dashboard");
}
