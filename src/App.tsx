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
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

const TWITTER_URL = "https://twitter.com/MaaarkManson";

type Message = {
  author: "Human" | "Mark";
  content: string;
};

type History = Array<Message>;

function App() {
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<History>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const params = new URLSearchParams(window.location.search);
  const openAIApiKey = params.get("openAIApiKey");
  const [apiKey, setApiKey] = useState<string>(openAIApiKey || "");
  const [isDialogOpened, setDialogState] = useState<boolean>(false);

  type MutationData = { aiResponse: string };
  type MutationError = AxiosError;
  type MutationVariables = {
    newHistory: History;
    openAIApiKey: string;
    message: string;
    history: History;
  };
  const mutation = useMutation<MutationData, MutationError, MutationVariables>({
    mutationFn: ({ newHistory, openAIApiKey }) =>
      axios
        .post("/.netlify/functions/completions", {
          history: newHistory,
          openAIApiKey,
          message,
        })
        .then((res) => res.data),
    retry: 3,
    onError: (error, { message, history }, context) => {
      debugger;
      setLoading(false);
      setMessage(message);
      setHistory(history);
      window.alert("Something went wrong, sorry, I'll look into that.");
    },
    onSuccess: (data) => {
      setHistory([...history, { author: "Mark", content: data.aiResponse }]);
      setLoading(false);
      inputRef.current?.focus();
    },
  });

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
    mutation.mutate({ newHistory, openAIApiKey: apiKey, message, history });
  };

  return (
    <Container
      maxWidth={"sm"}
      disableGutters
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
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
        <OpenInNewIcon onClick={() => window.open(TWITTER_URL, "_blank")} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
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
          alignItems: "center",
        })}
      >
        <TextField
          ref={inputRef}
          multiline
          maxRows={10}
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
