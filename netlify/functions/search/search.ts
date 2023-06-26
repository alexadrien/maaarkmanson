import { Handler } from "@netlify/functions";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Response } from "@netlify/functions/dist/function/response";

type SimilaritySearchRequestBody = {
  openAIApiKey: string;
  query: string;
};

const pineconeApiKey = process.env.PINECONE_API_KEY || "";
const pineconeEnvironment = process.env.PINECONE_ENVIRONMENT || "";
const pineconeIndexName = process.env.PINECONE_INDEX || "";
const openAIApiKey = process.env.OPEN_AI_API_KEY || "";

const ErrorResponse: (code: number, message?: string) => Response = (
  statusCode,
  message: string = ""
) => ({
  statusCode,
  body: message,
});

export const handler: Handler = async ({ httpMethod, body }) => {
  if (httpMethod !== "POST")
    return ErrorResponse(405, "Only POST Method allowed");

  if (!body) return ErrorResponse(400, "Request as no payload");

  const requestBody = JSON.parse(body) as SimilaritySearchRequestBody;
  const { query } = requestBody;
  if (!query) return ErrorResponse(400, "Missing query");

  const pineconeClient = new PineconeClient();
  await pineconeClient.init({
    apiKey: pineconeApiKey,
    environment: pineconeEnvironment,
  });
  const pineconeIndex = pineconeClient.Index(pineconeIndexName);

  const openAIEmbeddings = new OpenAIEmbeddings({ openAIApiKey });
  const dbConfig = { pineconeIndex };
  const vectorStore = await PineconeStore.fromExistingIndex(
    openAIEmbeddings,
    dbConfig
  );

  const similaritySearchResults = await vectorStore.similaritySearch(query, 1);

  if (similaritySearchResults.length < 1)
    return ErrorResponse(500, "Similarity search did not return any results");

  const firstSearchResult = similaritySearchResults[0];
  return {
    statusCode: 200,
    body: JSON.stringify({
      content: firstSearchResult.pageContent,
      source: firstSearchResult.metadata.source,
      type: firstSearchResult.metadata.type,
      title: firstSearchResult.metadata.title,
    }),
  };
};
