import { History } from "../types";
import { Configuration, OpenAIApi } from "openai";
import { useRecoilValue } from "recoil";
import { openAiApiKeyAtom } from "../atoms";
import { NO_OPENAI_KEY, UNABLE_TO_PRODUCE_MESSAGE } from "../errors";
import { CreateChatCompletionRequest } from "openai/api";

export const useNextMessage = () => {
  const apiKey = useRecoilValue(openAiApiKeyAtom);
  const nextMessage = async (
    history: History,
    temperature: number = 1
  ): Promise<History> => {
    if (!apiKey) throw Error(NO_OPENAI_KEY);
    const params = { apiKey };
    const configuration = new Configuration(params);
    const openai = new OpenAIApi(configuration);
    const completionRequest: CreateChatCompletionRequest = {
      model: "gpt-3.5-turbo",
      messages: history,
      temperature,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    const chatCompletion = await openai.createChatCompletion(completionRequest);
    const newMessage = chatCompletion.data.choices[0].message;
    if (!newMessage) throw Error(UNABLE_TO_PRODUCE_MESSAGE);
    console.table({ ...history, newMessage });
    return [...history, newMessage];
  };
  return { nextMessage };
};
