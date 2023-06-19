import React from "react";
import Box from "@mui/material/Box";
import { AppBarActions } from "./AppBarActions";

type IProps = {
  deleteHistory: () => void;
};

export const AppBar: React.FC<IProps> = ({ deleteHistory }) => {
  return (
    <Box
      sx={{
        padding: 2,
        paddingLeft: 2,
        fontWeight: "bold",
        boxShadow: "none",
        borderBottom: "solid 1px black",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
      }}
    >
      MAAARK MANSON
      <AppBarActions deleteHistory={deleteHistory} />
    </Box>
  );
};
