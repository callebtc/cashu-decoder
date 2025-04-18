import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Paper,
  Typography,
  useTheme as useMuiTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDecodedToken, getEncodedToken, Token } from "@cashu/cashu-ts";
import ReactJson, { InteractionProps } from "react-json-view";
import Editor from "@monaco-editor/react";
import ThemeToggle from "./ThemeToggle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  "& .MuiInputBase-root": {
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  "& .MuiInputBase-input": {
    height: "100% !important",
    fontFamily: "monospace",
    overflowX: "auto",
    wordBreak: "break-all",
    WebkitHyphens: "none",
    MozHyphens: "none",
    hyphens: "none",
    fontSize: "0.9em",
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

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

const JsonContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  backgroundColor: theme.palette.background.paper,
  padding: "10px",
  borderRadius: "4px",
  border: `1px solid ${theme.palette.divider}`,
  "& .react-json-view": {
    height: "100%",
  },
  "& .react-json-view .icon-container": {
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
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
        <Header>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6" color="textPrimary">
              Token
            </Typography>
            <ButtonGroup>
              <Tooltip title="Copy token">
                <IconButton
                  size="small"
                  onClick={handleCopyToken}
                  disabled={!tokenInput}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear token">
                <IconButton
                  size="small"
                  onClick={handleClearToken}
                  disabled={!tokenInput}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </Box>
          {isMobile && <ThemeToggle />}
        </Header>
        <StyledTextField
          multiline
          fullWidth
          value={tokenInput}
          onChange={handleTokenChange}
          placeholder="Paste your Cashu token here..."
          variant="outlined"
        />
        {error && <ErrorText variant="body2">{error}</ErrorText>}
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
        <JsonContainer>
          {jsonContent && !editorMode && (
            <ReactJson
              src={jsonContent}
              theme={theme.palette.mode === "dark" ? "monokai" : "rjv-default"}
              onEdit={handleJsonChange}
              displayDataTypes={false}
              enableClipboard={false}
              style={{
                backgroundColor: "transparent",
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            />
          )}
          {editorMode && (
            <Editor
              height="100%"
              language="json"
              value={editorContent}
              onChange={handleEditorChange}
              theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
              }}
            />
          )}
        </JsonContainer>
      </Panel>
    </Container>
  );
};

export default SplitScreen;
