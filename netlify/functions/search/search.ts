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

const ErrorResponse: (code: number, message?: string) => Response = (
  statusCode,
  message: string = ""
) => ({
  statusCode,
  body: message,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST")
    return ErrorResponse(405, "Only POST Method allowed");

  const { body } = event;
  if (!body) return ErrorResponse(400, "Request as no payload");

  const { openAIApiKey, history } = JSON.parse(
    body
  ) as CompletionAPIRequestBody;
  if (!openAIApiKey) return ErrorResponse(400, "Missing openAIApiKey");
  if (!history) return ErrorResponse(400, "Missing history");

  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
  });
  const pineconeIndex = client.Index(process.env.PINECONE_INDEX || "");

  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey }),
    { pineconeIndex }
  );

  const resultOne = await vectorStore.similaritySearch(
    history[history.length - 1].content,
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
