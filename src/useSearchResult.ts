import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { History } from "./types";

export const useSearchResult = () => {
  const searchMutation = useMutation<
    { searchResult: string },
    unknown,
    { openAIApiKey: string; history: History }
  >({
    mutationFn: ({ openAIApiKey, history }) =>
      axios
        .post("/.netlify/functions/search", {
          openAIApiKey,
          history,
        })
        .then((res) => res.data),
  });
  return async (history: History, openAIApiKey: string) => {
    const { searchResult } = await searchMutation.mutateAsync({
      openAIApiKey,
      history,
    });
    return searchResult;
  };
};
