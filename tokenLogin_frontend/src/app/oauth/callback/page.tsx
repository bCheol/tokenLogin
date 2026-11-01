"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function OAuthCallback() {

  const searchParams = useSearchParams();

  useEffect(() => {
    const success = !searchParams.get("error");

    const channel = new BroadcastChannel("oauth");
    channel.postMessage(
      { type: success ? "OAUTH_SUCCESS" : "OAUTH_FAIL" ,
        accessToken: searchParams.get('accessToken')
      }
    );
    channel.close();

    window.close();
  }, [searchParams]);

  return;
}