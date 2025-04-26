import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import React, { ReactNode } from "react";
  
  const appTheme = createTheme({
    palette: {
      primary: {
        main: "#01579b", // Main blue from sidebar
        light: "#ade4ff", // Light blue from cards
        dark: "#004080", // Dark blue from headings
      },
      secondary: {
        main: "#044080", // Blue text on cards
      },
      text: {
        primary: "#1e1e1e", // Header text color
        secondary: "#222222", // Dashboard title color
      },
      background: {
        default: "#ffffff", // White background
        paper: "#ffffff",
      },
      common: {
        white: "#ffffff",
        black: "#000000",
      },
    },
    typography: {
      fontFamily: ["Almarai", "Alata", "Helvetica", "Arial", "sans-serif"].join(
        ",",
      ),
      h1: {
        fontFamily: "Almarai-ExtraBold, Helvetica",
        fontWeight: 800,
        fontSize: "2.5rem", // 40px
        lineHeight: "normal",
      },
      h2: {
        fontFamily: "Almarai-Bold, Helvetica",
        fontWeight: 700,
        fontSize: "2rem", // 32px
        lineHeight: "normal",
        color: "#004080",
      },
      h3: {
        fontFamily: "Alata-Regular, Helvetica",
        fontWeight: 400,
        fontSize: "1.875rem", // 30px
        lineHeight: "normal",
      },
      h4: {
        fontFamily: "Almarai-Bold, Helvetica",
        fontWeight: 700,
        fontSize: "1.5rem", // 24px
        lineHeight: "normal",
        color: "#044080",
      },
      body1: {
        fontFamily: "Almarai-Regular, Helvetica",
        fontWeight: 400,
        fontSize: "1.5rem", // 24px
        lineHeight: "normal",
      },
      button: {
        fontFamily: "Almarai-Bold, Helvetica",
        fontWeight: 700,
        fontSize: "1.5rem", // 24px
        lineHeight: "normal",
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: "#ffffff",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            backgroundColor: "#ffffff",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "20px",
            boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.25)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.25)",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: "#01579b",
            color: "#ffffff",
          },
        },
      },
      MuiListItemText: {
        styleOverrides: {
          primary: ({ theme }) => ({
            ...theme.typography.body1,
            color: "#ffffff",
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: "#ade4ff",
            borderRadius: "20px",
            boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.25)",
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            "&:last-child": {
              paddingBottom: "10px",
            },
          },
        },
      },
    },
  });
  
  type ThemeProviderProps = {
    children: ReactNode;
  };

  export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    return (
      <MuiThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    );
  };