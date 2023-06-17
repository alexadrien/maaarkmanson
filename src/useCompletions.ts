import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { History, Message } from "./types";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { useNewPlaceholder } from "./atoms";

export const useCompletions = () => {
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
        new SystemChatMessage(
          `You are an AI Therapist called Mark Manson.
          Your personality is based on Mark Manson, the real-life author.
          Your messages should imitate the way Mark Manson write his content.
          End every message with a self-reflecting question to the user.
          Use patient's first name everytime it is possible.
          When using a quote from Mark Manson, answer using 'I' statements.
          Always respond with a message which is as long as the previous user message.
          All your messages should have only one question per message.
          Keep your messages short.
          Start by asking for the user's first name.
          `
        ),
        ...history.slice(0, history.length - 1).map(constructMessage),
        new SystemChatMessage(
          `Use the quote from you below delimited by triple quotes as an inspiration for your next message.
          Only use it if relevant to the last user message.
  
        """${searchResult}"""
        `
        ),
        ...history
          .slice(history.length - 1, history.length)
          .map(constructMessage),
      ]);
      chatResponses.push(chatResponse.text);
    }

    setPlaceholder("Finding the best message");
    const finalChatResponse = await chat.call([
      new SystemChatMessage(
        `You are an AI Therapist called Mark Manson.
          Your personality is based on Mark Manson, the real-life author.
          Your messages should imitate the way Mark Manson write his content.
          End every message with a self-reflecting question to the user.
          Use patient's first name everytime it is possible.
          When using a quote from Mark Manson, answer using 'I' statements.
          Always respond with a message which is as long as the previous user message.
          All your messages should have only one question per message.
          Keep your messages short.
          Start by asking for the user's first name.
          `
      ),
      ...history.map(constructMessage),
      new SystemChatMessage(
        `Output the best message for the user between those below (each message is separated with three equal signs)
          
          Messages:
          ${chatResponses.join("\n\n===\n\n")} 
          `
      ),
    ]);

    setPlaceholder("Oh Hi Maaark!\nMy name is");
    return finalChatResponse.text;
  };
};
