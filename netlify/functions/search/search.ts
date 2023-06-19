import { Handler } from "@netlify/functions";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Response } from "@netlify/functions/dist/function/response";

type CompletionAPIRequestBody = {
  openAIApiKey: string;
  history: Array<{
    author: "Human" | "Mark";
    content: string;
  }>;
};

const ErrorResponse: Response = {
  statusCode: 500,
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") return ErrorResponse;

  const { body } = event;
  if (!body) return ErrorResponse;

  const parsedBody = JSON.parse(body) as CompletionAPIRequestBody;
  if (!parsedBody.openAIApiKey) return ErrorResponse;

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

  if (resultOne.length < 1) throw Error("No results");

  return {
    statusCode: 200,
    body: JSON.stringify({
      searchResult: resultOne[0].pageContent,
    }),
  };
};
