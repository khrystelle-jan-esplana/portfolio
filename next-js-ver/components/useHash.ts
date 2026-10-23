"use client";
import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  addEventListener("hashchange", cb);
  const id = setInterval(cb, 200);
  return () => { removeEventListener("hashchange", cb); clearInterval(id); };
};
export const useHash = () => useSyncExternalStore(subscribe, () => location.hash.slice(1), () => "");