import LandingPage from "@/components/LandingPage";
import {redirect} from "next/navigation";
export default function Home() {
  return (
    // <LandingPage />
    redirect("/dashboard")
  )
}