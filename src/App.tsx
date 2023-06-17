import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { History, Message } from "./types";
import { useSearchResult } from "./useSearchResult";
import { useCompletions } from "./useCompletions";
import { useSaveToLocalStorage } from "./useSaveToLocalStorage";
import { useGetFromLocalStorage } from "./useGetFromLocalStorage";
import RefreshIcon from "@mui/icons-material/Refresh";
import { usePlaceholder } from "./atoms";

const TWITTER_URL = "https://twitter.com/MaaarkManson";

function App() {
  const [savedHistory, savedMessage, deleteHistory] = useGetFromLocalStorage();
  const [message, setMessage] = useState<string>(savedMessage);
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<History>(savedHistory);
  useSaveToLocalStorage(history);
  const inputRef = useRef<HTMLInputElement>(null);
  const params = new URLSearchParams(window.location.search);
  const openAIApiKey = params.get("openAIApiKey");
  const [apiKey, setApiKey] = useState<string>(openAIApiKey || "");
  const [isDialogOpened, setDialogState] = useState<boolean>(false);
  const getSearchResults = useSearchResult();
  const getCompletions = useCompletions();
  const placeholder = usePlaceholder();

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
    const response = await getCompletions(searchResults, apiKey, newHistory);
    setHistory([...newHistory, { author: "Mark", content: response }]);
    setLoading(false);
    inputRef.current?.scrollIntoView();
  };

  return (
    <Container
      maxWidth={"sm"}
      disableGutters
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        maxHeight: "100%",
      }}
    >
      <Box
        sx={{
          padding: 2,
          paddingLeft: 2,
          fontWeight: "bold",
          boxShadow: "none",
          borderBottom: "solid 1px black",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        MAAARK MANSON
        <Box
          sx={{
            width: "15%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <OpenInNewIcon onClick={() => window.open(TWITTER_URL, "_blank")} />
          <RefreshIcon onClick={deleteHistory} />
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
        {history.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: message.author === "Mark" ? "start" : "end",
              padding: "0px 8px 0px 8px",
              borderBottom: "solid 1px lightgrey",
            }}
          >
            <Typography variant={"overline"}>{message.author}:</Typography>
            <Typography
              variant={"body1"}
              align={message.author === "Human" ? "right" : "left"}
              sx={{
                fontWeight: message.author === "Human" ? "bold" : "regular",
                whiteSpace: "break-spaces",
              }}
            >
              {message.content}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={(theme) => ({
          borderTop: "solid 1px black",
          width: "100%",
          padding: 2,
          display: "flex",
          justifyContent: "space-between",
          background: theme.palette.background.default,
          alignItems: "flex-start",
        })}
      >
        <TextField
          ref={inputRef}
          multiline
          placeholder={placeholder}
          maxRows={10}
          minRows={2}
          disabled={loading}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Fab color="primary" aria-label="add" onClick={onSend}>
          {loading ? <CircularProgress /> : <SendIcon />}
        </Fab>
      </Box>
      <Dialog open={isDialogOpened}>
        <Typography variant={"body1"}>
          You need an API key from OpenAI to continue.
        </Typography>
        <TextField
          placeholder={"OpenAI Api Key"}
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
        />
        <Button
          onClick={() =>
            window.open(`${window.location.origin}?openAIApiKey=${apiKey}`)
          }
        >
          Continue
        </Button>
      </Dialog>
    </Container>
  );
}

export default App;
