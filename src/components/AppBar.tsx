import React from "react";
import Box from "@mui/material/Box";
import LaunchIcon from "@mui/icons-material/Launch";
import { Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useClearLocalStorage } from "../hooks/useClearLocalStorage";

export const AppBar: React.FC = () => {
  const refresh = useClearLocalStorage();
  return (
    <Box
      sx={(theme) => ({
        borderBottom: "solid 1px black",
        padding: theme.spacing(2),
        display: "flex",
        alignItems: "center",
      })}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant={"button"}>MAAARK MANSON</Typography>
      </Box>
      <Box
        sx={(theme) => ({
          paddingRight: theme.spacing(1),
          display: "flex",
          alignItems: "center",
        })}
      >
        <LaunchIcon
          onClick={() =>
            window.open("https://twitter.com/MaaarkManson", "_blank")
          }
        />
      </Box>
      <RefreshIcon onClick={refresh} />
    </Box>
  );
};
