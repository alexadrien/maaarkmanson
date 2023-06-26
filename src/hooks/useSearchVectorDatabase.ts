import axios from "axios";
import { SearchContent } from "../types";

export const useSearchVectorDatabase = () => {
  const search = (query: string): Promise<SearchContent | null> =>
    axios
      .post("/.netlify/functions/search", {
        query,
      })
      .then((res) => res.data)
      .catch(() => null);
  return {
    search,
  };
};
