import React from "react";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  styled,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ClearIcon from "@mui/icons-material/Clear";

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

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

interface TokenInputProps {
  tokenInput: string;
  error: string | null;
  handleTokenChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCopyToken: () => void;
  handleClearToken: () => void;
  children?: React.ReactNode;
}

const TokenInput: React.FC<TokenInputProps> = ({
  tokenInput,
  error,
  handleTokenChange,
  handleCopyToken,
  handleClearToken,
  children,
}) => {
  return (
    <>
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
        {children}
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
    </>
  );
};

export default TokenInput;
