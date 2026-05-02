"use client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ViewedProvider } from "../context/ViewedContext";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4f8ef7" },
    secondary: { main: "#f7a14f" },
    background: { default: "#0d1117", paper: "#161b22" },
    success: { main: "#3fb950" },
    warning: { main: "#d29922" },
    error: { main: "#f85149" },
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h4: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: "0.72rem" },
      },
    },
  },
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>Campus Notifications</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ViewedProvider>{children}</ViewedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
