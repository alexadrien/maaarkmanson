import React from "react";
import Box from "@mui/material/Box";
import { useRecoilValue } from "recoil";
import { chatHistoryAtom } from "../atoms";
import { ChatCompletionRequestMessageRoleEnum } from "openai/api";
import { Typography } from "@mui/material";
import Linkify from "react-linkify";

export const ChatHistory: React.FC = () => {
  const history = useRecoilValue(chatHistoryAtom);
  const acceptableRoles: ChatCompletionRequestMessageRoleEnum[] = [
    "user",
    "assistant",
  ];
  return (
    <Box>
      {history
        .filter((message) => acceptableRoles.includes(message.role))
        .map((message, index) => {
          const alignment = message.role === "user" ? "end" : "start";
          return (
            <Box
              key={index}
              sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                alignItems: alignment,
                borderBottom: "solid 1px lightgrey",
                padding: theme.spacing(1),
              })}
            >
              <Box sx={(theme) => ({ marginBottom: theme.spacing(0.5) })}>
                <Typography variant={"caption"} textAlign={alignment}>
                  {message.role === "user" ? "You" : "Maaark"}:
                </Typography>
              </Box>

              <Typography
                variant={"body1"}
                whiteSpace={"pre-line"}
                textAlign={alignment}
              >
                <Linkify>{message.content}</Linkify>
              </Typography>
            </Box>
          );
        })}
    </Box>
  );
};
