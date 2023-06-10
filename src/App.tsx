import React, { useRef, useState } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import axios from "axios";

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

  const onSend = async () => {
    if (!message) return;
    const newHistory = [
      ...history,
      { author: "Human", content: message } as Message,
    ];
    setHistory(newHistory);
    setLoading(true);
    setMessage("");
    await axios
      .post("/.netlify/functions/completions", {
        history: newHistory,
      })
      .then((res) => res.data)
      .then((data) => {
        setHistory([
          ...newHistory,
          { author: "Mark", content: data.resB.text },
        ]);
        setLoading(false);
        inputRef.current?.focus();
      })
      .catch(console.error);
  };

  return (
    <Box sx={{ minHeight: "100vh", maxWidth: "400px", position: "relative" }}>
      <Box>
        <AppBar>
          MAAARK MANSON
          <OpenInNewIcon onClick={() => window.open(TWITTER_URL, "_blank")} />
        </AppBar>
      </Box>
      <Box sx={{ marginTop: "65px", marginBottom: "75px" }}>
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
            <Typography variant={"body1"}>{message.content}</Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={(theme) => ({
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "solid 1px black",
          width: "100%",
          padding: "10px 20px",
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
    </Box>
  );
}

export default App;
