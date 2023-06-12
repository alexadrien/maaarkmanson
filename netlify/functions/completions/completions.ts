import { Handler } from "@netlify/functions";
import { ChatOpenAI } from "langchain/chat_models";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";

type CompletionAPIRequestBody = {
  openAIApiKey: string;
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
  if (!parsedBody.openAIApiKey) return { statusCode: 500 };

  try {
    const chat = new ChatOpenAI({
      temperature: 1,
      openAIApiKey: parsedBody.openAIApiKey,
    });
    const response = await chat.call([
      new SystemChatMessage(
        `You are an AI Therapist called Mark Manson.
        Your personality is based on Mark Manson, the real-life author.
        End every message with a self-reflecting question to the user.`
      ),
      ...parsedBody.history.map((message) =>
        message.author === "Human"
          ? new HumanChatMessage(message.content)
          : new AIChatMessage(message.content)
      ),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        parsedBody,
        response,
        aiResponse: response.text,
      }),
    };
  } catch (e: any) {
    if (e.statusCode === 401)
      return {
        statusCode: 401,
      };
    return {
      statusCode: 500,
      body: JSON.stringify({ e }),
    };
  }
};
