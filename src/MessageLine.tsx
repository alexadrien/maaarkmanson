import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { Message } from "./types";

type IProps = {
  index: number;
  message: Message;
};

export const MessageLine: React.FC<IProps> = ({ index, message }) => {
  return (
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
  );
};
