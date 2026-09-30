"use client";

import { useEffect } from "react";

export default function TrackView({ productId }: { productId: string }) {
  useEffect(() => {
    const key = `viewed:${productId}`;

    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}

    navigator.sendBeacon(`/api/product/${productId}/views`);
  }, [productId]);

  return null;
}
