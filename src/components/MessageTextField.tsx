import React, { Dispatch, RefObject, SetStateAction } from "react";
import { TextField } from "@mui/material";

type IProps = {
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  inputRef: RefObject<HTMLInputElement>;
  textFieldPlaceholder: string;
  loading: boolean;
};

export const MessageTextField: React.FC<IProps> = ({
  setMessage,
  message,
  inputRef,
  textFieldPlaceholder,
  loading,
}) => {
  return (
    <TextField
      ref={inputRef}
      multiline
      placeholder={textFieldPlaceholder}
      maxRows={10}
      minRows={2}
      disabled={loading}
      value={message}
      onChange={(event) => setMessage(event.target.value)}
    />
  );
};
