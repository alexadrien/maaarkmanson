/* eslint-disable react-hooks/exhaustive-deps */
import {useRecoilValue, useSetRecoilState} from "recoil";
import {chatHistoryAtom, loadingAtom} from "../atoms";
import {useEffect} from "react";
import {useNextMessage} from "./useNextMessage";

export const useFirstMessage = () => {
  const history = useRecoilValue(chatHistoryAtom);
  const updateHistory = useSetRecoilState(chatHistoryAtom);
  const setLoadingState = useSetRecoilState(loadingAtom);
  const { nextMessage } = useNextMessage();

  useEffect(() => {
    if (history.length > 0) {
      setLoadingState(false);
      return;
    }
    nextMessage([
      {
        role: "system",
        content: `You are a Chat Bot.
Start by writing my a welcome message to start the conversation.
I want you to :
- Impersonate Mark Manson
- Start by asking for user’s first name 
- Relate only on Mark Manson’s work

I don't want you to :
- refer to the user's first name before the user's first message.
    `,
      },
    ])
      .then((value) => {
        updateHistory([value[value.length - 1]]);
        setLoadingState(false);
      })
      .catch((reason: unknown) => {
        throw reason;
      });
  }, []);
};
