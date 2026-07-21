import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const MonacoEditor = ({
  value,
  onChange,
  fontSize = 14,
  theme = 'vs-dark',
  readOnly = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define premium custom dark theme
    monaco.editor.defineTheme('codepilot-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6' },
        { token: 'string', foreground: 'f1fa8c' },
        { token: 'number', foreground: 'bd93f9' },
        { token: 'regexp', foreground: 'f1fa8c' },
        { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
        { token: 'class', foreground: '50fa7b' },
        { token: 'function', foreground: '50fa7b' },
        { token: 'variable', foreground: 'f8f8f2' },
      ],
      colors: {
        'editor.background': '#05070d',
        'editor.foreground': '#f8f8f2',
        'editor.lineHighlightBackground': '#0b0f19',
        'editor.lineHighlightBorder': '#1e293b00',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#a78bfa',
        'editorGutter.background': '#05070d',
        'scrollbarSlider.background': '#3b82f615',
        'scrollbarSlider.hoverBackground': '#3b82f630',
        'scrollbarSlider.activeBackground': '#3b82f645',
        'editorWidget.background': '#0f172a',
        'editorWidget.border': '#1e293b',
      }
    });

    // Update theme selection
    if (theme === 'vs-dark') {
      monaco.editor.setTheme('codepilot-dark');
    } else {
      monaco.editor.setTheme(theme);
    }

    // Set focus listeners to handle placeholder display
    editor.onDidFocusEditorText(() => setIsFocused(true));
    editor.onDidBlurEditorText(() => setIsFocused(false));
  };

  useEffect(() => {
    // Dynamic theme updating
    if (editorRef.current) {
      const monacoInstance = window.monaco;
      if (monacoInstance) {
        if (theme === 'vs-dark') {
          monacoInstance.editor.setTheme('codepilot-dark');
        } else {
          monacoInstance.editor.setTheme(theme);
        }
      }
    }
  }, [theme]);

  const handlePlaceholderClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const showPlaceholder = !value && !isFocused;

  const editorOptions = {
    fontSize,
    readOnly,
    minimap: { enabled: false },
    wordWrap: 'on',
    lineNumbers: 'on',
    automaticLayout: true,
    autoIndent: 'advanced',
    tabSize: 4,
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Fira Mono', monospace",
    fontLigatures: true,
    padding: { top: 16, bottom: 16 },
    renderLineHighlight: 'all',
    scrollBeyondLastLine: false,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    smoothScrolling: true,
  };

  return (
    <div className="flex-1 min-h-[300px] bg-[#05070d] rounded-b-2xl relative overflow-hidden flex flex-col">
      {showPlaceholder && (
        <div 
          onClick={handlePlaceholderClick}
          className="absolute inset-0 z-10 p-6 pt-8 pl-14 font-mono text-sm text-gray-600 select-none cursor-text leading-relaxed whitespace-pre-line"
        >
          {`# Paste your Python code here...

def example_function():
    # Write code or upload a .py file on the left side
    pass`}
        </div>
      )}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language="python"
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="absolute inset-0 flex items-center justify-center bg-[#05070d]">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
                <span className="text-xs text-gray-500 font-medium">Loading Monaco Editor...</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
