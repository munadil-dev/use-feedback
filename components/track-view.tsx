"use client";

import { useEffect, useRef } from "react";

export default function TrackView({ productId }: { productId: string }) {
  const pending = useRef(false);

  useEffect(() => {
    const key = `viewed:${productId}`;

    try {
      if (sessionStorage.getItem(key)) return;
    } catch {}

    if (pending.current) return;
    pending.current = true;

    fetch(`/api/product/${productId}/views`, {
      method: "POST",
      keepalive: true,
    })
      .then((res) => {
        if (!res.ok) return;

        try {
          sessionStorage.setItem(key, "1");
        } catch {}
      })
      .catch(() => {})
      .finally(() => {
        pending.current = false;
      });
  }, [productId]);

  return null;
}
