import React from "react";
import MuiContainer from "@mui/material/Container";

type IProps = {
  children: React.ReactNode;
};

export const Container: React.FC<IProps> = ({ children }) => {
  return (
    <MuiContainer disableGutters maxWidth={"sm"}>
      {children}
    </MuiContainer>
  );
};
