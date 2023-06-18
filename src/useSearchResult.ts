import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { History } from "./types";
import { SystemChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { useNewPlaceholder } from "./atoms";
import { CREATE_SIMILARITY_SEARCH } from "./prompts";

export const useSearchResult = () => {
  const setPlaceholder = useNewPlaceholder();
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
    const chat = new ChatOpenAI({
      temperature: 1,
      openAIApiKey,
    });
    setPlaceholder("Understanding your message");
    const lastMessage = history[history.length - 1].content;
    const searchSimilarityQuery = await chat.call([
      new SystemChatMessage(CREATE_SIMILARITY_SEARCH(lastMessage)),
    ]);
    const listOfqueries = [
      ...searchSimilarityQuery.text.split("\n"),
      lastMessage,
    ];
    const searchResults = [];
    setPlaceholder("Searching Maaark's brain");
    for (let i = 0; i < listOfqueries.length; i++) {
      const currentQuery = listOfqueries[i];
      const { searchResult } = await searchMutation.mutateAsync({
        openAIApiKey,
        history: [...history, { author: "Mark", content: currentQuery }],
      });
      searchResults.push(searchResult);
    }

    return searchResults;
  };
};
