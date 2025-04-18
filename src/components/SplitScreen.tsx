import React, { useState } from "react";
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
  padding: theme.spacing(3),
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
  },
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  height: 40,
}));

const ContentContainer = styled(Box)(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginTop: theme.spacing(1),
}));

const JsonContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: "auto",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
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

const SplitScreen: React.FC = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [jsonContent, setJsonContent] = useState<Token | null>(null);
  const [error, setError] = useState<string | null>(null);
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setTokenInput(input);
    setError(null);

    if (input.trim()) {
      try {
        const decodedToken = getDecodedToken(input);
        setJsonContent(decodedToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse token");
        setJsonContent(null);
      }
    } else {
      setJsonContent(null);
    }
  };

  const handleJsonChange = (edit: InteractionProps) => {
    if (edit.updated_src) {
      setJsonContent(edit.updated_src as Token);
      setError(null);

      try {
        const encodedToken = getEncodedToken(edit.updated_src as Token);
        setTokenInput(encodedToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to encode token");
      }
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
  };

  const handleCopyJson = () => {
    if (jsonContent) {
      navigator.clipboard.writeText(JSON.stringify(jsonContent, null, 2));
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
        <ContentContainer>
          <StyledTextField
            multiline
            fullWidth
            value={tokenInput}
            onChange={handleTokenChange}
            placeholder="Paste your Cashu token here..."
            variant="outlined"
          />
          {error && <ErrorText variant="body2">{error}</ErrorText>}
        </ContentContainer>
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
          </Box>
          {!isMobile && <ThemeToggle />}
        </Header>
        <ContentContainer>
          <JsonContainer>
            {jsonContent && (
              <ReactJson
                src={jsonContent}
                theme={
                  theme.palette.mode === "dark" ? "monokai" : "rjv-default"
                }
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
          </JsonContainer>
        </ContentContainer>
      </Panel>
    </Container>
  );
};

export default SplitScreen;
