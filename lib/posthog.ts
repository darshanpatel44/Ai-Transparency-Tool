"use client";

import posthog from "posthog-js";

export const usePostHog = () => {
  return posthog;
};

// Helper functions for common PostHog operations
export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== "undefined") {
    posthog.capture(eventName, {
      project: "said",
      ...properties,
    });
  }
};

export const identifyUser = (
  userId: string,
  properties?: Record<string, any>
) => {
  if (typeof window !== "undefined") {
    posthog.identify(userId, properties);
  }
};

export const resetUser = () => {
  if (typeof window !== "undefined") {
    posthog.reset();
  }
};
