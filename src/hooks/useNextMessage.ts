import { History } from "../types";
import { CreateChatCompletionResponse } from "openai";
import { UNABLE_TO_PRODUCE_MESSAGE } from "../errors";
import { CreateChatCompletionRequest } from "openai/api";
import axios from "axios";

export const useNextMessage = () => {
  const nextMessage = async (
    history: History,
    temperature: number = 1
  ): Promise<History> => {
    const completionRequest: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: history,
      temperature,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    const baseUrl = process.env.REACT_APP_API_BASE_URL || "";
    const url = `${baseUrl}/chat/completions`;
    const chatCompletion: CreateChatCompletionResponse = await axios
      .post(url, completionRequest)
      .then((res) => res.data);
    const newMessage = chatCompletion.choices[0].message;
    if (!newMessage) throw Error(UNABLE_TO_PRODUCE_MESSAGE);
    console.table({ ...history, newMessage });
    return [...history, newMessage];
  };
  return { nextMessage };
};
