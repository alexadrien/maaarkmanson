export const useGetFromLocalStorage = () => {
  return [
    JSON.parse(localStorage.getItem(`${window.origin}-chat-history`) || "[]"),
    () => {
      localStorage.removeItem(`${window.origin}-chat-history`);
      window.location.reload();
    },
  ];
};
