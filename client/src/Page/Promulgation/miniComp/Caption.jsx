import { useState,useRef } from "react";

export default function CaptionEl() {
  const editorRef = useRef();

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleInput = () => {
    const html = editorRef.current.innerHTML;
    onChange && onChange(html);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50">
        <button className="btn" onClick={() => exec("bold")}>B</button>
        <button className="btn italic" onClick={() => exec("italic")}>I</button>
        <button className="btn underline" onClick={() => exec("underline")}>U</button>
        <button className="btn line-through" onClick={() => exec("strikeThrough")}>S</button>

        <button className="btn" onClick={() => exec("formatBlock", "h1")}>H1</button>
        <button className="btn" onClick={() => exec("formatBlock", "h2")}>H2</button>
        <button className="btn" onClick={() => exec("formatBlock", "h3")}>H3</button>

        <button className="btn" onClick={() => exec("insertHTML", "<code>code</code>")}>
          {"</>"}
        </button>

        <button
          className="btn"
          onClick={() =>
            exec("insertHTML", "<pre><code>Your code here</code></pre>")
          }
        >
          Code Block
        </button>

        <button
          className="btn"
          onClick={() => {
            const url = prompt("Enter link URL:");
            if (url) exec("createLink", url);
          }}
        >
          Link
        </button>

        <button
          className="btn"
          onClick={() => exec("insertHTML", "😊")}
        >
          😊
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-40 p-3 border rounded leading-relaxed focus:outline-none prose max-w-none"
      />
    </div>
  );
}