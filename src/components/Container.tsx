import React from "react";
import MuiContainer from "@mui/material/Container";

type IProps = {
  children: React.ReactNode;
};

export const Container: React.FC<IProps> = ({ children }) => {
  return (
    <MuiContainer
      maxWidth={"sm"}
      disableGutters
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        maxHeight: "100%",
      }}
    >
      {children}
    </MuiContainer>
  );
};
