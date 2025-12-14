import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $getRoot,
} from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import DOMPurify from "dompurify";
import { usePostStore } from "../../../lib/basicUserinfo";

const LIMIT = 300;

/* ---------------- CONFIG ---------------- */

const editorConfig = {
  namespace: "CaptionEditor",
  theme: {
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
      strikethrough: "line-through",
    },
  },
  onError(error) {
    throw error;
  },
};



export default function CaptionEl() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="w-full flex flex-col gap-2 h-full">
        <Toolbar />
        <Editor />
      </div>
    </LexicalComposer>
  );
}



function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        setActive({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          underline: selection.hasFormat("underline"),
          strikethrough: selection.hasFormat("strikethrough"),
        });
      });
    });
  }, [editor]);

  const btnClass = (on) =>
    `capBtn ${on ? "bg-[rgba(80,80,80,0.4)]" : ""}`;

  return (
    <div className="flex gap-2 sticky top-0 bg-skin-bg p-2 rounded-xl z-10">
      <button className={btnClass(active.bold)} onMouseDown={e => e.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}><i className="bx bx-bold" /></button>
      <button className={btnClass(active.italic)} onMouseDown={e => e.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}><i className="bx bx-italic" /></button>
      <button className={btnClass(active.underline)} onMouseDown={e => e.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}><i className="bx bx-underline" /></button>
      <button className={btnClass(active.strikethrough)} onMouseDown={e => e.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}><i className="bx bx-strikethrough" /></button>
    </div>
  );
}


function Editor() {
  const { postOBJ, setPostOBJ } = usePostStore();
  const [editor] = useLexicalComposerContext();

  const initialized = useRef(false);
  const [count, setCount] = useState(0);

  const sanitize = (html) =>
    DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "strong", "em" , "u", "s", "p", "br", "pre", "code"],
    });


  useEffect(() => {

    if (!postOBJ?.caption) {
      initialized.current = true;
      return;
    }


    editor.update(() => {
      const dom = new DOMParser().parseFromString(postOBJ.caption, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();

      root.clear();
      root.append(...nodes);
      setCount(root.getTextContent().length);
    });

    initialized.current = true;
  }, [editor]);

  return (
    <div className="relative h-full my-scroll p-2">
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="outline-none caret-skin-text text-skin-text" />
        }
        placeholder={<p className="absolute top-0 left-2 text-gray-400">Write a caption…</p>}
      />

      <div className="absolute bottom-0 right-3 text-xs text-gray-400">
        {count}/{LIMIT}
      </div>

      <HistoryPlugin />

      <OnChangePlugin
        onChange={(editorState, editor) => {
          if (!initialized.current) return;

          editorState.read(() => {
            const root = $getRoot();
            const len = root.getTextContent().length;

            setCount(len);

            if (len > LIMIT) return;

            const html = sanitize(editor.getRootElement()?.innerHTML || "");
            setPostOBJ({ caption: html });
          });
        }}
      />
    </div>
  );
}
