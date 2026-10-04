"use client";

import { useEffect, useState } from "react";

/**
 * Portal pages render on the client after sign-in, so the browser can't jump to a
 * #fragment on load. This returns the current hash and scrolls its element into view.
 */
export function useHash(): string {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const update = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      setHash(h);
      if (h) requestAnimationFrame(() => document.getElementById(h)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return hash;
}
