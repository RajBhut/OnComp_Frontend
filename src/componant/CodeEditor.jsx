import { useRef } from "react";

import Editor from "@monaco-editor/react";

const CodeEditor = ({
  handle_change,
  launguage = "javascript",
  value,
  map = false,

  handlesubmit,
}) => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editor.onKeyDown((event) => {
      const { keyCode, ctrlKey } = event;
      if (keyCode === 3 && ctrlKey) {
        event.preventDefault();

        handlesubmit();
      }
    });
  }

  return (
    <div style={{ height: "500px" }}>
      <Editor
        onMount={handleEditorDidMount}
        height="100%"
        defaultLanguage={launguage}
        defaultValue="// Start coding here"
        theme="vs-dark"
        onChange={handle_change}
        value={value}
        options={{
          minimap: { enabled: map },
        }}
      />
    </div>
  );
};

export default CodeEditor;
