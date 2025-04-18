import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material";
import { useTheme } from "./context/ThemeContext";
import SplitScreen from "./components/SplitScreen";
import { ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  const { isDarkMode } = useTheme();

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      background: {
        default: isDarkMode ? "#0a0a0a" : "#f5f5f5",
        paper: isDarkMode ? "#141414" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#333333",
        secondary: isDarkMode ? "#b0b0b0" : "#666666",
      },
      divider: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <SplitScreen />
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
