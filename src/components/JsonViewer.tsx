import React from "react";
import { Box, styled } from "@mui/material";
import ReactJson, { InteractionProps } from "react-json-view";
import { Token } from "@cashu/cashu-ts";

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

interface JsonViewerProps {
  jsonContent: Token;
  themeMode: "dark" | "light";
  onEdit: (edit: InteractionProps) => void;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  jsonContent,
  themeMode,
  onEdit,
}) => {
  return (
    <JsonContainer>
      <ReactJson
        src={jsonContent}
        theme={themeMode === "dark" ? "monokai" : "rjv-default"}
        onEdit={onEdit}
        displayDataTypes={false}
        enableClipboard={false}
        style={{
          backgroundColor: "transparent",
          fontSize: "14px",
          fontFamily: "monospace",
        }}
      />
    </JsonContainer>
  );
};

export default JsonViewer;
