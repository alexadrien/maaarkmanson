import React from "react";
import Box from "@mui/material/Box";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";

const TWITTER_URL = "https://twitter.com/MaaarkManson";

type IProps = {
  deleteHistory: () => void;
};

export const AppBarActions: React.FC<IProps> = ({ deleteHistory }) => {
  return (
    <Box
      sx={{
        width: "15%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <OpenInNewIcon onClick={() => window.open(TWITTER_URL, "_blank")} />
      <RefreshIcon onClick={deleteHistory} />
    </Box>
  );
};
