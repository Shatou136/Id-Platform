"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa";

export function RegisterServiceWorker() {
  useEffect(() => {
    void registerServiceWorker();
  }, []);
  return null;
}
