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
            Your job is to produce a search query intended to be run over a vectorial database.
            The database contains a lot of Mark Manson Quotes.
            The search query should only be keywords.
            
            Last User Message :
            ${history[history.length - 1].content}`
      ),
    ]);
    const { searchResult } = await searchMutation.mutateAsync({
      openAIApiKey,
      history: [
        ...history,
        { author: "Mark", content: searchSimilarityQuery.text },
      ],
    });
    return searchResult;
  };
};
