import React from "react";
import Box from "@mui/material/Box";

type IProps = {
  children: React.ReactNode[];
};

export const RedactionBar: React.FC<IProps> = ({ children }) => {
  return (
    <Box
      sx={(theme) => ({
        borderTop: "solid 1px black",
        width: "100%",
        padding: 2,
        display: "flex",
        justifyContent: "space-between",
        background: theme.palette.background.default,
        alignItems: "flex-start",
      })}
    >
      {children}
    </Box>
  );
};
