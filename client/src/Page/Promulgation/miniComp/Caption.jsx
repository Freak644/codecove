import { useRef, useState, useEffect } from "react";
import { usePostStore } from "../../../lib/basicUserinfo";
import DOMPurify from 'dompurify';

export default function CaptionEl() {
  const editorRef = useRef(null);
  const LIMIT = 300;
  let {postOBJ,setPostOBJ} = usePostStore();
  const [textLenght,setLength] = useState(0);
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

  const cleanHTML = dirty=>{
    return DOMPurify.sanitize(dirty,{
      USE_PROFILES: {html:true}
    });
  }

  useEffect(()=>{
    setPostOBJ({caption:cleanHTML(editorRef.current?.innerHTML)})
  },[active])

  useEffect(()=>{
    editorRef.current.focus();
    if (postOBJ.caption?.length>1) {
      console.log(postOBJ)
        editorRef.current.innerHTML = postOBJ.caption;
    }
  },[])

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

  const handleInput = () => {
    const el = editorRef.current;
    const text = el.innerText;
    setLength(text.length)
    if (text.length > LIMIT) {
      const allowed = text.substring(0, LIMIT);
      el.innerText = allowed;

      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
};

  const handlePaste = (e) => {
    e.preventDefault();

    const el = editorRef.current;
    const clipboard = (e.clipboardData || window.clipboardData).getData("text");
    const current = el.innerText;
    const remaining = LIMIT - current.length;

    if (remaining <= 0) return setLength(300);

    const toInsert = clipboard.substring(0, remaining);
    document.execCommand("insertText", false, toInsert);
};


  return (
    <div className="w-full flex flex-col gap-2 relative ">

      <div className="flex h-12 gap-2 items-center sticky top-0 bg-skin-bg rounded-2xl">

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

        <div className="counter absolute right-2">
          <p className="text-[12px]">{`${textLenght}`}/{LIMIT}</p>
        </div>

      </div>


      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        spellCheck={false}
        className=" min-h-68 sm:min-h-[180px]  my-scroll w-full p-2 wrap-break-word outline-none text-skin-text caret-skin-text"
      />
    </div>
  );
}
