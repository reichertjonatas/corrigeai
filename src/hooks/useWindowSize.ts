import { useState, useLayoutEffect, useEffect, useMemo } from "react";

export function getVpWidth() {
  return typeof window !== "undefined"
    ? Math.max(
        window.document.documentElement.clientWidth,
        window.innerWidth || 0
      )
    : 0;
}

function getVpHeight() {
  return typeof window !== "undefined"
    ? Math.max(
        window.document.documentElement.clientHeight,
        window.innerHeight || 0
      )
    : 0;
}
