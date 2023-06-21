import React from "react";
import { Container } from "./components/Container";
import { AppBar } from "./components/AppBar";
import { ChatHistory } from "./components/ChatHistory";
import { RedactionBar } from "./components/RedactionBar";
import { useFirstMessage } from "./hooks/useFirstMessage";
import { Box } from "@mui/material";

function App() {
  useFirstMessage();
  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <AppBar />
        <Box sx={{ flexGrow: 1, overflow: "scroll" }}>
          <ChatHistory />
        </Box>
        <RedactionBar />
      </Box>
    </Container>
  );
}

export default App;
