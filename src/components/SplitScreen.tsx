import React, { useState } from "react";
import { Box, TextField, Paper, Typography, Alert } from "@mui/material";
import { styled } from "@mui/material/styles";
import { getDecodedToken, getEncodedToken, Token } from "@cashu/cashu-ts";

const SplitContainer = styled(Box)({
  display: "flex",
  height: "100vh",
  gap: "20px",
  padding: "20px",
});

const Panel = styled(Paper)({
  flex: 1,
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const SplitScreen: React.FC = () => {
  const [tokenInput, setTokenInput] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setTokenInput(input);
    setError(null);

    if (input.trim()) {
      try {
        const decodedToken = getDecodedToken(input);
        setJsonContent(JSON.stringify(decodedToken, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse token");
        setJsonContent("");
      }
    } else {
      setJsonContent("");
    }
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setJsonContent(input);
    setError(null);

    if (input.trim()) {
      try {
        const parsedJson = JSON.parse(input) as Token;
        const encodedToken = getEncodedToken(parsedJson);
        setTokenInput(encodedToken);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to encode token");
      }
    } else {
      setTokenInput("");
    }
  };

  return (
    <SplitContainer>
      <Panel elevation={3}>
        <Typography variant="h6">Cashu Token</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          fullWidth
          multiline
          rows={10}
          value={tokenInput}
          onChange={handleTokenChange}
          placeholder="Enter Cashu token (cashuA... or cashuB...)"
          variant="outlined"
        />
      </Panel>
      <Panel elevation={3}>
        <Typography variant="h6">Parsed JSON</Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          value={jsonContent}
          onChange={handleJsonChange}
          placeholder="JSON content will appear here"
          variant="outlined"
        />
      </Panel>
    </SplitContainer>
  );
};

export default SplitScreen;
