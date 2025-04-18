import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  useTheme as useMuiTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  styled,
} from "@mui/material";
import { getDecodedToken, getEncodedToken, Token } from "@cashu/cashu-ts";
import { InteractionProps } from "react-json-view";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThemeToggle from "./ThemeToggle";
import TokenInput from "./TokenInput";
import JsonViewer from "./JsonViewer";
import JsonEditor from "./JsonEditor";

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const Panel = styled(Paper)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  height: "100%",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    height: "50%",
  },
}));

const Divider = styled(Box)(({ theme }) => ({
  width: "1px",
  backgroundColor: theme.palette.divider,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "1px",
  },
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(0.5, 0),
  height: theme.spacing(6),
}));

const ToggleText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  cursor: "pointer",
  marginLeft: theme.spacing(1),
  "&:hover": {
    textDecoration: "underline",
  },
}));

const SplitScreen: React.FC = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [jsonContent, setJsonContent] = useState<Token | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [lastValidJson, setLastValidJson] = useState<Token | null>(null);
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const savedToken = localStorage.getItem("cashuToken");
    if (savedToken) {
      setTokenInput(savedToken);
      try {
        const decodedToken = getDecodedToken(savedToken);
        setJsonContent(decodedToken);
        setLastValidJson(decodedToken);
        setEditorContent(JSON.stringify(decodedToken, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse token");
      }
    }
  }, []);

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setTokenInput(input);
    setError(null);

    if (input.trim()) {
      try {
        const decodedToken = getDecodedToken(input);
        setJsonContent(decodedToken);
        setLastValidJson(decodedToken);
        setEditorContent(JSON.stringify(decodedToken, null, 2));
        localStorage.setItem("cashuToken", input);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse token");
        setJsonContent(null);
      }
    } else {
      setJsonContent(null);
      localStorage.removeItem("cashuToken");
    }
  };

  const handleJsonChange = (edit: InteractionProps) => {
    if (edit.updated_src) {
      setJsonContent(edit.updated_src as Token);
      setLastValidJson(edit.updated_src as Token);
      setEditorContent(JSON.stringify(edit.updated_src, null, 2));
      setError(null);

      try {
        const encodedToken = getEncodedToken(edit.updated_src as Token);
        setTokenInput(encodedToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to encode token");
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;

    setEditorContent(value);
    setError(null);

    try {
      const parsedJson = JSON.parse(value) as Token;
      setJsonContent(parsedJson);
      setLastValidJson(parsedJson);

      try {
        const encodedToken = getEncodedToken(parsedJson);
        setTokenInput(encodedToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to encode token");
      }
    } catch {
      // Don't update the JSON content if there's a parse error
      setError("Invalid JSON");
    }
  };

  const handleCopyToken = () => {
    if (tokenInput) {
      navigator.clipboard.writeText(tokenInput);
    }
  };

  const handleClearToken = () => {
    setTokenInput("");
    setJsonContent(null);
    setError(null);
    localStorage.removeItem("cashuToken");
  };

  const handleCopyJson = () => {
    if (jsonContent) {
      navigator.clipboard.writeText(JSON.stringify(jsonContent, null, 2));
    }
  };

  const toggleEditorMode = () => {
    setEditorMode(!editorMode);
    if (!editorMode && jsonContent) {
      // Switching to editor mode, update editor content with formatted JSON
      setEditorContent(JSON.stringify(jsonContent, null, 2));
    } else if (editorMode) {
      // Switching to viewer mode, use the last valid JSON
      setJsonContent(lastValidJson);
    }
  };

  return (
    <Container>
      <Panel>
        <TokenInput
          tokenInput={tokenInput}
          error={error}
          handleTokenChange={handleTokenChange}
          handleCopyToken={handleCopyToken}
          handleClearToken={handleClearToken}
        >
          {isMobile && <ThemeToggle />}
        </TokenInput>
      </Panel>
      <Divider />
      <Panel>
        <Header>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" color="textPrimary">
              JSON
            </Typography>
            <Tooltip title="Copy JSON">
              <IconButton
                size="small"
                onClick={handleCopyJson}
                disabled={!jsonContent}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <ToggleText onClick={toggleEditorMode} variant="caption">
              {editorMode ? "Toggle viewer" : "Toggle editor"}
            </ToggleText>
          </Box>
          {!isMobile && <ThemeToggle />}
        </Header>
        {jsonContent && !editorMode && (
          <JsonViewer
            jsonContent={jsonContent}
            themeMode={theme.palette.mode}
            onEdit={handleJsonChange}
          />
        )}
        {editorMode && (
          <JsonEditor
            editorContent={editorContent}
            themeMode={theme.palette.mode}
            onChange={handleEditorChange}
          />
        )}
      </Panel>
    </Container>
  );
};

export default SplitScreen;
