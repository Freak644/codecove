import { useState } from "react";

export default  function Caption({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-white w-full h-2/3 my-scroll">
      <div
        className={
          expanded
            ? "whitespace-pre-wrap"
            : "caption-1-5-lines whitespace-pre-wrap"
        }
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {!expanded && (
        <button
          className="text-skin-text text-sm font-semibold ml-1"
          onClick={() => setExpanded(true)}
        >
          ...more
        </button>
      )}

      {expanded && (
        <button
          className="text-skin-text text-sm font-semibold ml-1"
          onClick={() => setExpanded(false)}
        >
          show less
        </button>
      )}
    </div>
  );
}
