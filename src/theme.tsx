import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F26823",
    },
    secondary: {
      main: "#DAE5E6",
    },
    background: {
      default: "#DAE5E6",
    },
  },
  typography: {
    fontFamily: "Montserrat",
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: "transparent",
      },
      styleOverrides: {
        root: {
          padding: 20,
          paddingLeft: 16,
          fontWeight: "bold",
          boxShadow: "none",
          borderBottom: "solid 1px black",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "standard",
        placeholder: "Oh Hi Mark",
      },
      styleOverrides: {
        root: {
          minHeight: "100%",
          flexGrow: 1,
          paddingRight: "16px",
        },
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        color: "secondary",
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "0px",
          margin: "0px",
        },
      },
    },
  },
});
