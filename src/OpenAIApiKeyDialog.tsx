import React, { Dispatch, SetStateAction } from "react";
import { Button, TextField, Typography } from "@mui/material";
import MuiDialog from "@mui/material/Dialog";

type IProps = {
  isDialogOpened: boolean;
  apiKey: string;
  setApiKey: Dispatch<SetStateAction<string>>;
};

export const OpenAIApiKeyDialog: React.FC<IProps> = ({
  isDialogOpened,
  apiKey,
  setApiKey,
}) => {
  return (
    <MuiDialog open={isDialogOpened}>
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
    </MuiDialog>
  );
};
