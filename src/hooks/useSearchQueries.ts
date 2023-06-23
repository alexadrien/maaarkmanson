import { useNextMessage } from "./useNextMessage";

export const useSearchQueries = () => {
  const { nextMessage } = useNextMessage();
  const shouldAiGenerateSearchQueries = async (
    draft: string
  ): Promise<boolean> =>
    nextMessage(
      [
        {
          role: "user",
          content: draft,
        },
        {
          role: "user",
          content: `If my previous message mentions topics related to Mark Manson's work, send 'RELATED_TO_MARK_MANSON_WORK'.
If my previous message is only a courtesy message, send 'N/A'.
If my previous message is only a greeting and/or an inquiry about your well-being, send 'N/A'.
If my previous message contains only small talk, send 'N/A'.
If you need clarification to be able to tell if my previous message mentions topics related to Mark Manson's work, send 'N/A'.
If my previous message mentions how I feel, send 'RELATED_TO_MARK_MANSON_WORK'.
Else, send 'N/A'.`,
        },
      ],
      0
    ).then((value) => {
      const lastMessage = value[value.length - 1];
      if (!lastMessage) return false;
      if (!lastMessage.content) return false;
      return lastMessage.content?.search("RELATED_TO_MARK_MANSON_WORK") > -1;
    });
  const generateSearchQueries = async (draft: string): Promise<Array<string>> =>
    nextMessage(
      [
        {
          role: "user",
          content: draft,
        },
        {
          role: "user",
          content: `Create a few search queries related to how I feel according to my previous message.
The search queries should be delimited with a new line
Each search query should be composed of a few keywords
Don't output anything else than the search queries
Don't output any boilerplate text
Don't output any explanation
        `,
        },
      ],
      0
    ).then((value) => {
      const lastMessage = value[value.length - 1];
      if (!lastMessage) return [];
      if (!lastMessage.content) return [];
      return lastMessage.content.split("\n");
    });
  return {
    shouldAiGenerateSearchQueries,
    generateSearchQueries,
  };
};
