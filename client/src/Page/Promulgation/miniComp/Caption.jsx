import { useRef, useState, useEffect } from "react";

export default function CaptionEl() {
  const editorRef = useRef(null);
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false
  });


  const updateActive = () => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough")
    });
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActive);
    return () => document.removeEventListener("selectionchange", updateActive);
  }, []);

  const exec = (cmd, value = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, value);
    updateActive();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;
    exec("createLink", url);
  };

  const insertCodeBlock = () => {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);

    const pre = document.createElement("pre");
    pre.className = "bg-black text-skin-text p-2 rounded break-words";

    const code = document.createElement("code");
    code.textContent = "your code here";

    pre.appendChild(code);
    range.insertNode(pre);
  };

  return (
    <div className="w-full flex flex-col gap-2">

      <div className="flex gap-2 items-center">

        <button
          className={`capBtn ${active.bold ? "bg-gray-500/50" : ""}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
        >
          <i className="bx bx-bold"></i>
        </button>

        <button
          className={`capBtn ${active.italic ? "bg-gray-500/50" : ""}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("italic")}
        >
          <i className="bx bx-italic"></i>
        </button>

        <button
          className={`capBtn ${active.underline ? "bg-gray-500/50" : ""}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("underline")}
        >
          <i className="bx bx-underline"></i>
        </button>

        <button
          className={`capBtn ${active.strike ? "bg-gray-500/50" : ""}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("strikeThrough")}
        >
          <i className="bx bx-strikethrough"></i>
        </button>

        <button
          className="capBtn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertLink}
        >
          <i className="bx bx-link"></i>
        </button>

        <button
          className="capBtn"
          onMouseDown={(e) => e.preventDefault()}
          onClick={insertCodeBlock}
        >
          <i className="bx bx-code-block"></i>
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        spellCheck={false}
        className="min-h-[140px] max-w-[500px] p-2 wrap-break-word outline-none text-skin-text caret-skin-text"
      />
    </div>
  );
}
