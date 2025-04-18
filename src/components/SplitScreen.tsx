import React, { useState } from "react";
import { Box, TextField, Paper, Typography, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDecodedToken, getEncodedToken, Token } from "@cashu/cashu-ts";
import ReactJson, { InteractionProps } from "react-json-view";

const SplitContainer = styled(Box)({
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  backgroundColor: "#f5f5f5",
});

const Panel = styled(Paper)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "20px",
  borderRadius: 0,
  boxShadow: "none",
  backgroundColor: "#ffffff",
  height: "100%",
  overflow: "hidden",
});

const Divider = styled(Box)({
  width: "1px",
  backgroundColor: "#e0e0e0",
});

const StyledTextField = styled(TextField)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  "& .MuiOutlinedInput-root": {
    fontFamily: "monospace",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  "& .MuiInputBase-input": {
    flex: 1,
    height: "auto !important",
  },
});

const JsonContainer = styled(Box)({
  flex: 1,
  overflow: "auto",
  backgroundColor: "#ffffff",
  padding: "10px",
  borderRadius: "4px",
  border: "1px solid #e0e0e0",
  "& .react-json-view": {
    height: "100%",
  },
  "& .react-json-view .icon-container": {
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
});

const SplitScreen: React.FC = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [jsonContent, setJsonContent] = useState<Token | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <SplitContainer>
      <Panel>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#333",
          }}
        >
          Cashu Token
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <StyledTextField
          fullWidth
          multiline
          value={tokenInput}
          onChange={handleTokenChange}
          placeholder="Enter Cashu token (cashuA... or cashuB...)"
          variant="outlined"
        />
      </Panel>
      <Divider />
      <Panel>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#333",
          }}
        >
          Parsed JSON
        </Typography>
        <JsonContainer>
          {jsonContent && (
            <ReactJson
              src={jsonContent}
              theme="rjv-default"
              name={false}
              displayDataTypes={false}
              enableClipboard={false}
              style={{ fontFamily: "monospace", fontSize: "14px" }}
              onEdit={handleJsonChange}
            />
          )}
        </JsonContainer>
      </Panel>
    </SplitContainer>
  );
};

export default SplitScreen;
