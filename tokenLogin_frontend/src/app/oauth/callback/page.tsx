import { Suspense } from "react";
import OAuthCallback from "@/components/auth/OAuthCallback";

export default function OAuthCallbackPage() {
  return (
      <Suspense>
           <OAuthCallback />
      </Suspense>
  )
}