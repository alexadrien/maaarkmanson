import React from "react";
import { CircularProgress, Fab } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

type IProps = {
  onSend: () => void;
  loading: boolean;
};

export const SendButton: React.FC<IProps> = ({ onSend, loading }) => {
  return (
    <Fab color="primary" aria-label="add" onClick={onSend}>
      {loading ? <CircularProgress /> : <SendIcon />}
    </Fab>
  );
};
