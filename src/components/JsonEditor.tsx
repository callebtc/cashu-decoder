import React from "react";
import { Box, styled } from "@mui/material";
import Editor from "@monaco-editor/react";

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

interface JsonEditorProps {
  editorContent: string;
  themeMode: "dark" | "light";
  onChange: (value: string | undefined) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({
  editorContent,
  themeMode,
  onChange,
}) => {
  return (
    <JsonContainer>
      <Editor
        height="100%"
        language="json"
        value={editorContent}
        onChange={onChange}
        theme={themeMode === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </JsonContainer>
  );
};

export default JsonEditor;
