import React from "react";
import Box from "@mui/material/Box";
import { MessageLine } from "./MessageLine";
import { History } from "./types";

type IProps = {
  history: History;
};

export const Messages: React.FC<IProps> = ({ history }) => {
  const messageLines = history.map((message, index) => (
    <MessageLine index={index} message={message} />
  ));
  return <Box sx={{ flexGrow: 1, overflow: "scroll" }}>{messageLines}</Box>;
};
