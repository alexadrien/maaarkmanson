import { useNextMessage } from "./useNextMessage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { chatHistoryAtom, loadingAtom } from "../atoms";
import { ChatCompletionRequestMessage } from "openai/api";
import { History } from "../types";
import { useSearchQueries } from "./useSearchQueries";
import { useRecommendation } from "./useRecommendation";

export const useSendDraft = () => {
  const { nextMessage } = useNextMessage();
  const history = useRecoilValue(chatHistoryAtom);
  const setHistory = useSetRecoilState(chatHistoryAtom);
  const { shouldAiGenerateSearchQueries } = useSearchQueries();
  const { getRecommendationMessage } = useRecommendation();
  const setLoadingState = useSetRecoilState(loadingAtom);
  const sendDraft = async (draft: string): Promise<void> => {
    setLoadingState(true);
    const newMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: draft,
    };
    const newHistory: History = [...history, newMessage];
    setHistory(newHistory);
    const messageIsRelatedToContent = await shouldAiGenerateSearchQueries(
      draft
    );
    if (messageIsRelatedToContent) {
      const recommendation = await getRecommendationMessage(draft);
      setHistory([...newHistory, recommendation]);
      setLoadingState(false);
      return;
    }
    await nextMessage(newHistory).then((history) => {
      setHistory(history);
      setLoadingState(false);
    });
  };
  return { sendDraft };
};
