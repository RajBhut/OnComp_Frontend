import React, { useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";

const CodeEditor = ({ handle_change, launguage = "javascript", value }) => {
  return (
    <div style={{ height: "500px" }}>
      <MonacoEditor
        height="100%"
        defaultLanguage={launguage}
        defaultValue="// Start coding here"
        theme="vs-dark"
        onChange={handle_change}
        value={value}
      />
    </div>
  );
};

export default CodeEditor;
