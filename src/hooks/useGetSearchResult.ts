import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { History } from "../types";
import { SystemChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { useNewPlaceholder } from "../atoms";
import { CREATE_SIMILARITY_SEARCH } from "../prompts";

export const useGetSearchResult = () => {
  const setPlaceholder = useNewPlaceholder();

  type SearchVariables = { openAIApiKey: string; history: History };
  const searchFunction = ({ openAIApiKey, history }: SearchVariables) =>
    axios
      .post("/.netlify/functions/search", {
        openAIApiKey,
        history,
      })
      .then((res) => res.data);
  const searchMutation = useMutation<
    { searchResult: string },
    unknown,
    SearchVariables
  >({
    mutationFn: searchFunction,
  });

  return async (history: History, openAIApiKey: string) => {
    setPlaceholder("Understanding your message");
    const chat = new ChatOpenAI({ temperature: 1, openAIApiKey });
    const lastMessageContent = history[history.length - 1].content;
    const queriesFromAi = await chat.call([
      new SystemChatMessage(CREATE_SIMILARITY_SEARCH(lastMessageContent)),
    ]);
    const listOfQueries = [
      ...queriesFromAi.text.split("\n"),
      lastMessageContent,
    ];
    const searchResults = [];

    setPlaceholder("Searching Maaark's brain");
    for (let i = 0; i < listOfQueries.length; i++) {
      const currentQuery = listOfQueries[i];
      const newHistory: History = [
        ...history,
        { author: "Mark", content: currentQuery },
      ];
      const { searchResult } = await searchMutation.mutateAsync({
        openAIApiKey,
        history: newHistory,
      });
      searchResults.push(searchResult);
    }

    return searchResults;
  };
};
