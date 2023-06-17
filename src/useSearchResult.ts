import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { History } from "./types";
import { SystemChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

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
    const chat = new ChatOpenAI({
      temperature: 1,
      openAIApiKey,
    });
    const searchSimilarityQuery = await chat.call([
      new SystemChatMessage(
        `You are a super smart AI therapist. Your personality is based on Mark Manson's.
            You will be provided with a user message.
            Your job is to produce a list of 5 search queries intended to be run over a vectorial database.
            The database contains a lot of Mark Manson Quotes.
            Each search query should be composed of 3 keywords separated by commas.
            The list should not be numerated, no bullet point, just a plain line-by-line list. 
            
            Last User Message :
            ${history[history.length - 1].content}`
      ),
    ]);
    const listOfqueries = searchSimilarityQuery.text.split("\n");
    const searchResults = [];
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
