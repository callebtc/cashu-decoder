import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import SplitScreen from "./components/SplitScreen";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SplitScreen />
    </ThemeProvider>
  );
}

export default App;
