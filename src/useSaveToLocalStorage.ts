import { History } from "./types";
import { useEffect } from "react";

export const useSaveToLocalStorage = (history: History) => {
  useEffect(() => {
    localStorage.setItem(
      `${window.origin}-chat-history`,
      JSON.stringify(history, null, 2)
    );
  }, [history]);
  return JSON.parse(
    localStorage.getItem(`${window.origin}-chat-history`) || "[]"
  );
};
