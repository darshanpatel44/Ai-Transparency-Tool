"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if PostHog is initialized and not running in development
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV !== "development"
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: "2025-05-24",
        capture_pageview: false, // Disable automatic pageview capture as we'll do it manually
      });

      // Add custom property
      posthog.register({
        project: "said",
        site: window.location.hostname,
      });
    }
  }, []);

  useEffect(() => {
    // Track pageviews
    if (pathname && typeof window !== "undefined") {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
