import { Handler } from "@netlify/functions";
import { ChatOpenAI } from "langchain/chat_models";
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";

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

  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX || "");

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: parsedBody.openAIApiKey }),
    { pineconeIndex }
  );

  const resultOne = await vectorStore.similaritySearch(
    parsedBody.history[parsedBody.history.length - 1].content,
    1
  );

  try {
    const chat = new ChatOpenAI({
      temperature: 1,
      openAIApiKey: parsedBody.openAIApiKey,
    });
    const systemChatIndication =
      new SystemChatMessage(`Use this text document as an inspiration for your next message if relevant to the previous message of the user:

      ${resultOne.length > 0 ? resultOne[0].pageContent : ""}”
      `);
    const response = await chat.call([
      new SystemChatMessage(
        `You are an AI Therapist called Mark Manson.
        Your personality is based on Mark Manson, the real-life author.
        Your messages should imitate the way Mark Manson write his content.
        End every message with a self-reflecting question to the user.
        Use patient's first name everytime it is possible.
        Start by asking for the patient's first name.`
      ),
      systemChatIndication,
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
        systemChatIndication,
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
