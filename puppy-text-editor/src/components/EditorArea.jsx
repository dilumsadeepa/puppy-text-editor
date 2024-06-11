import React, { useState, useEffect } from 'react';

const EditorArea = ({ content, onChange, isDarkMode }) => {
  const [editorContent, setEditorContent] = useState(content); 

  useEffect(() => {
    setEditorContent(content); // Update state when prop changes
  }, [content]);

  const handleInput = (event) => {
    setEditorContent(event.target.innerHTML); 
    onChange(event.target.innerHTML); 
  };

  return (
    <div 
      id="editor" 
      contentEditable="true" 
      onInput={handleInput}
      // dangerouslySetInnerHTML={{ __html: editorContent }} 
      className={`editor-area ${isDarkMode ? 'dark-mode' : ''}`} 
    />
  );
}

export default EditorArea;