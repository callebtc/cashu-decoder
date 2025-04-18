import { IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme as useCustomTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useCustomTheme();

  return (
    <IconButton onClick={toggleDarkMode} color="inherit">
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
