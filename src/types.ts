import { ChatCompletionRequestMessage } from "openai/api";

export type History = Array<ChatCompletionRequestMessage>;

export type SearchContent = {
  content: string;
  source: string;
  title: string;
  type: string;
};
