import axios from "axios";
import { useRecoilValue } from "recoil";
import { openAiApiKeyAtom } from "../atoms";
import { SearchContent } from "../types";

export const useSearchVectorDatabase = () => {
  const openAiApiKey = useRecoilValue(openAiApiKeyAtom);
  const search = (query: string): Promise<SearchContent | null> =>
    axios
      .post("/.netlify/functions/search", {
        openAIApiKey: openAiApiKey,
        query,
      })
      .then((res) => res.data)
      .catch(() => null);
  return {
    search,
  };
};
