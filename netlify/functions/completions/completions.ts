import { Handler } from "@netlify/functions";
import { ChatOpenAI } from "langchain/chat_models";
import {
  AIMessagePromptTemplate,
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain";

type CompletionAPIRequestBody = {
  history: Array<{
    author: "Human" | "Mark";
    content: string;
  }>;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 500 };

  const { body } = event;
  if (!body) return { statusCode: 500 };

  const parsedBody = JSON.parse(body) as CompletionAPIRequestBody;
  const chat = new ChatOpenAI({ temperature: 1 });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `You are an AI Therapist called Mark Manson.
      Your personality is based on Mark Manson, the real-life author.
      End every message with a self-reflecting question to user `
    ),
    ...parsedBody.history.map((message) =>
      message.author === "Human"
        ? HumanMessagePromptTemplate.fromTemplate(message.content)
        : AIMessagePromptTemplate.fromTemplate(message.content)
    ),
  ]);
  const chainB = new LLMChain({ prompt: chatPrompt, llm: chat });
  const resB = await chainB.call({});

  return {
    statusCode: 200,
    body: JSON.stringify({
      parsedBody,
      resB,
      chatPrompt,
      aiResponse: resB.text,
    }),
  };
};
