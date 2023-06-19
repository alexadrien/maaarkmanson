import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { History, Message } from "../types";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { useNewPlaceholder } from "../atoms";
import {
  FIND_BEST_MESSAGE,
  INITIAL_SYSTEM_MESSAGE,
  USE_QUOTE_SYSTEM_MESSAGE,
} from "../prompts";

export const useGetCompletions = () => {
  const setPlaceholder = useNewPlaceholder();
  return async (
    searchResults: string[],
    openAIApiKey: string,
    history: History
  ) => {
    const chat = new ChatOpenAI({
      temperature: 1,
      openAIApiKey,
    });
    const chatResponses = [];
    const constructMessage = (message: Message) =>
      message.author === "Human"
        ? new HumanChatMessage(message.content)
        : new AIChatMessage(message.content);
    for (let i = 0; i < searchResults.length; i++) {
      setPlaceholder("Writing option " + (i + 1));
      const searchResult = searchResults[i];
      const chatResponse = await chat.call([
        new SystemChatMessage(INITIAL_SYSTEM_MESSAGE),
        ...history.slice(0, history.length - 1).map(constructMessage),
        new SystemChatMessage(USE_QUOTE_SYSTEM_MESSAGE(searchResult)),
        ...history
          .slice(history.length - 1, history.length)
          .map(constructMessage),
      ]);
      chatResponses.push(chatResponse.text);
    }

    setPlaceholder("Finding the best message");
    const finalChatResponse = await chat.call([
      new SystemChatMessage(INITIAL_SYSTEM_MESSAGE),
      ...history.map(constructMessage),
      new SystemChatMessage(FIND_BEST_MESSAGE(chatResponses)),
    ]);

    setPlaceholder("Oh Hi Maaark!\nMy name is");
    return finalChatResponse.text;
  };
};
