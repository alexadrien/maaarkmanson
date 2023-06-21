import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import { useSendDraft } from "../hooks/useSendDraft";
import { chatHistoryAtom, loadingAtom } from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";

export const RedactionBar: React.FC = () => {
  const [draft, setDraft] = useState<string>();
  const { sendDraft } = useSendDraft();
  const isLoading = useRecoilValue(loadingAtom);
  const [history, setHistory] = useRecoilState(chatHistoryAtom);

  const onSend = () => {
    if (!draft) return;
    setDraft("");
    sendDraft(draft).catch(() => {
      setDraft(draft);
      setHistory(history);
    });
  };

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        padding: theme.spacing(1),
        borderTop: "solid 1px black",
      })}
    >
      <TextField
        variant={"standard"}
        sx={{ flexGrow: 1 }}
        disabled={isLoading}
        multiline
        maxRows={10}
        minRows={3}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button disabled={isLoading} onClick={onSend}>
        {isLoading ? "Thinking" : "Send"}
      </Button>
    </Box>
  );
};
