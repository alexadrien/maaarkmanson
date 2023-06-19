import { History } from "../types";

export const useGetFromLocalStorage = (): [History, string, () => void] => {
  let historyFromLocalStorage = JSON.parse(
    localStorage.getItem(`${window.origin}-chat-history`) || "[]"
  ) as History;
  const isLastMessageFromHuman =
    historyFromLocalStorage[historyFromLocalStorage.length - 1]?.author ===
    "Human";
  return [
    isLastMessageFromHuman
      ? historyFromLocalStorage.slice(0, historyFromLocalStorage.length - 1)
      : historyFromLocalStorage,
    isLastMessageFromHuman
      ? historyFromLocalStorage[historyFromLocalStorage.length - 1].content
      : "",
    () => {
      localStorage.removeItem(`${window.origin}-chat-history`);
      window.location.reload();
    },
  ];
};
