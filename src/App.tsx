import React, { useRef, useState } from "react";
import { History, Message } from "./types";
import { useGetSearchResult } from "./useGetSearchResult";
import { useGetCompletions } from "./useGetCompletions";
import { useSaveToLocalStorage } from "./useSaveToLocalStorage";
import { useGetFromLocalStorage } from "./useGetFromLocalStorage";
import { useTextFieldPlaceholder } from "./atoms";
import { useOpenAIApiKeyFromQueryParams } from "./useOpenAIApiKeyFromQueryParams";
import { Container } from "./Container";
import { OpenAIApiKeyDialog } from "./OpenAIApiKeyDialog";
import { SendButton } from "./SendButton";
import { MessageTextField } from "./MessageTextField";
import { RedactionBar } from "./RedactionBar";
import { Messages } from "./Messages";
import { AppBar } from "./AppBar";

function App() {
  const openAIApiKey = useOpenAIApiKeyFromQueryParams();
  const getSearchResults = useGetSearchResult();
  const getCompletions = useGetCompletions();
  const textFieldPlaceholder = useTextFieldPlaceholder();
  const [savedHistory, savedMessage, deleteHistory] = useGetFromLocalStorage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>(savedMessage);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<History>(savedHistory);
  const [apiKey, setApiKey] = useState<string>(openAIApiKey || "");
  const [isDialogOpened, setDialogState] = useState<boolean>(false);
  useSaveToLocalStorage(history);

  const scrollMessageIntoView = () => inputRef.current?.scrollIntoView();

  const onSend = async () => {
    if (!message) return;
    if (!apiKey) {
      setDialogState(true);
      return;
    }

    const newHistory = [
      ...history,
      { author: "Human", content: message } as Message,
    ];
    setHistory(newHistory);
    setLoading(true);
    setMessage("");
    const searchResults = await getSearchResults(newHistory, apiKey);
    const completions = await getCompletions(searchResults, apiKey, newHistory);
    setHistory([...newHistory, { author: "Mark", content: completions }]);
    setLoading(false);
    scrollMessageIntoView();
  };

  return (
    <Container>
      <AppBar deleteHistory={deleteHistory} />
      <Messages history={history} />
      <RedactionBar>
        <MessageTextField
          message={message}
          setMessage={setMessage}
          inputRef={inputRef}
          textFieldPlaceholder={textFieldPlaceholder}
          loading={loading}
        />
        <SendButton onSend={onSend} loading={loading} />
      </RedactionBar>
      <OpenAIApiKeyDialog
        isDialogOpened={isDialogOpened}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </Container>
  );
}

export default App;
