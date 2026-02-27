import { motion, useMotionValue, useDragControls, animate } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import CommentEl from "./commentContainer";

const CLOSE_THRESHOLD = 220;

export default function SheetMiddleWhare() {
  const y = useMotionValue(0);
  const controls = useDragControls();
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const handleDragEnd = (_, info) => {
    const isDraggingDown = info.offset.y > 0;

    const shouldClose =
      isDraggingDown &&
      (info.offset.y > CLOSE_THRESHOLD || info.velocity.y > 800);

    if (shouldClose) {
      navigate(-1);
    } else {
      animate(y, 0, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  };

  const startDrag = (event) => {
    // Only allow drag if scroll is at top
    if (scrollRef.current?.scrollTop === 0) {
      controls.start(event);
    }
  };

  return (
    <motion.div
      className="h-full w-full relative"
      drag="y"
      dragListener={false}   // VERY IMPORTANT
      dragControls={controls}
      dragElastic={0.2}
      style={{ y }}
      onDragEnd={handleDragEnd}
    >
      {/* Handle */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50">
        <div
          onPointerDown={startDrag}
          className="h-1.5 w-24 rounded-full bg-skin-login cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}  // 🔥 important on mobile
        />
      </div>

      {/* Scrollable Content */}
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-auto"
      >
        <CommentEl />
      </div>
    </motion.div>
  );
}