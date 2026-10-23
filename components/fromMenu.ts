"use client";
import { useSyncExternalStore } from "react";

const KEY = "from-menu";
const noop = () => () => {};

export const markFromMenu = () => { try { sessionStorage.setItem(KEY, "1"); } catch {} };
export const clearFromMenu = () => { try { sessionStorage.removeItem(KEY); } catch {} };
export const useFromMenu = () =>
  useSyncExternalStore(noop, () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } }, () => false);