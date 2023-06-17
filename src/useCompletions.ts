import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { History, Message } from "./types";
import { ChatOpenAI } from "langchain/chat_models/openai";

export const useCompletions = () => {
  return async (
    searchResult: string,
    openAIApiKey: string,
    history: History
  ) => {
    const chat = new ChatOpenAI({
      temperature: 1,
      openAIApiKey,
    });

    const constructMessage = (message: Message) =>
      message.author === "Human"
        ? new HumanChatMessage(message.content)
        : new AIChatMessage(message.content);
    const chatResponse = await chat.call([
      new SystemChatMessage(
        `You are an AI Therapist called Mark Manson.
        Your personality is based on Mark Manson, the real-life author.
        Your messages should imitate the way Mark Manson write his content.
        End every message with a self-reflecting question to the user.
        Use patient's first name everytime it is possible.
        Start by asking for the user's first name.
        When using a quote from Mark Manson, answer using 'I' statements.
        Always respond with a message which is as long as the previous user message.
        Use the quote from Mark Manson delimited by triple quotes as an inspiration for your next message if relevant to the last user message:
        
        """${searchResult}"""`
      ),
      ...history.map(constructMessage),
    ]);
    return chatResponse.text;
  };
};
