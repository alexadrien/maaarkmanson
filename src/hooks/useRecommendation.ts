import { SearchContent } from "../types";
import { ChatCompletionRequestMessage } from "openai/api";
import { useNextMessage } from "./useNextMessage";
import { useRecoilValue } from "recoil";
import { chatHistoryAtom } from "../atoms";
import { useSearchQueries } from "./useSearchQueries";
import { useSearchVectorDatabase } from "./useSearchVectorDatabase";

export const useRecommendation = () => {
  const { nextMessage } = useNextMessage();
  const history = useRecoilValue(chatHistoryAtom);
  const { generateSearchQueries } = useSearchQueries();
  const { search } = useSearchVectorDatabase();
  const getRecommendationMessage = async (draft: string) => {
    const searchQueries = await generateSearchQueries(draft);
    let searchResults: SearchContent[] = [];
    for (let i = 0; i < searchQueries.length; i++) {
      const searchQuery = searchQueries[i];
      const response = await search(searchQuery);
      if (response) searchResults = [...searchResults, response];
    }
    return askForRecommendationMessage(draft, searchResults);
  };
  const askForRecommendationMessage = async (
    draft: string,
    searchContent: SearchContent[]
  ): Promise<ChatCompletionRequestMessage> =>
    nextMessage([
      ...history,
      { role: "user", content: draft },
      {
        role: "user",
        content: `Given my previous message and the following extracts of Mark Manson's website, help me by recommending me to read some content written by Mark Manson's.
Add the source link of the article in your message.

${searchContent.length === 0 ? `No content found. Sorry.` : ``}
${searchContent.map(
  (content, index) => `Article ${index + 1} (${content.type}) : ${content.title}
Extract: 
${content.content}
Source:
${content.source}`
)}`,
      },
    ]).then((value) => value[value.length - 1]);
  return { askForRecommendationMessage, getRecommendationMessage };
};
