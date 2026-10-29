import type { Metadata } from "next";
import AppHome from "@/layout/AppHome";

export const metadata: Metadata = {
  title: "Home",
  description: "Home",
};

export default function Home() {
  return (
    <div>
      <AppHome />
    </div>
  );
}