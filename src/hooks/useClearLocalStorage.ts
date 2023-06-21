export const useClearLocalStorage = () => {
  return () => {
    localStorage.clear();
    window.location.reload();
  };
};
