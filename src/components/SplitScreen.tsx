import React, { useState } from 'react';
import { Box, TextField, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SplitContainer = styled(Box)({
  display: 'flex',
  height: '100vh',
  gap: '20px',
  padding: '20px',
});

const Panel = styled(Paper)({
  flex: 1,
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
});

const SplitScreen: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [jsonContent, setJsonContent] = useState('{}');

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenInput(event.target.value);
    // TODO: Implement token parsing logic
  };

  const handleJsonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJsonContent(event.target.value);
    // TODO: Implement JSON encoding logic
  };

  return (
    <SplitContainer>
      <Panel elevation={3}>
        <Typography variant="h6">Cashu Token</Typography>
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