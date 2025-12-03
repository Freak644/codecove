import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function ImageSlider({ imgArray, setArray }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [containerWidth,setWidth] = useState(0);
  let containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setWidth(el.getBoundingClientRect().width);
      console.log(el.getBoundingClientRect().width)
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const nextImg = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % imgArray.length);
  };

  const prevImg = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + imgArray.length) % imgArray.length);
  };

  const removeFile = () => {
    setArray((prev) => {
      const toRemove = prev[index];
      if (toRemove) URL.revokeObjectURL(toRemove.preview);
      const newArr = prev.filter((_, i) => i !== index);

      if (newArr.length === 0) {
        setIndex(0);
      } else if (index >= newArr.length) {
        setIndex(newArr.length - 1);
      }

      return newArr;
    });
  };

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? containerWidth : -containerWidth,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (dir) => ({
      x: dir > 0 ? -containerWidth : containerWidth,
      opacity: 0,
      zIndex: 0,
    }),
  };

  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;
  const swipeConstHold = 10000;

  return (
    <div ref={containerRef} className="relative h-full flex items-center justify-center w-full p-0!">
      {/* left arrow */}
      <button
        onClick={prevImg}
        className="absolute z-10 left-0 bg-transparent hidden sm:flex text-white w-9 h-9 rounded-full items-center justify-center hover:bg-gray-600 text-lg transition duration-100"
      >
        ⟵
      </button>

      { setArray &&
      <button
        onClick={removeFile}
        className="absolute cursor-pointer z-10 right-0 top-0 bg-transparent text-red-600 w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-600 text-lg transition duration-100"
      >
        X
      </button>
      }
      {/* slider container (your original setup) */}
      <div className={`h-full w-full flex items-center z-1 rounded-2xl bg-black/40 relative overflow-hidden touch-pan-y`}
      // style={{
      //   width:`${containerWidth}px`,
      // }}
      >
        <AnimatePresence initial={false} custom={direction}>
          {imgArray.length > 0 && (
            <motion.div
              key={index}
              className="absolute w-full h-full flex items-center justify-center"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: containerWidth, damping: 30 },
                opacity: { duration: 0.1 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                const offsetX = info.offset.x;
                const offsetY = info.offset.y;
                const velocityX = info.velocity.x;

                // ignore vertical scroll
                if (Math.abs(offsetY) > Math.abs(offsetX)) return;

                const swipe = swipePower(offsetX, velocityX);

                if (swipe < -swipeConstHold) nextImg();
                else if (swipe > swipeConstHold) prevImg();
              }}
            >
              {/* ⬇️ preserve aspect ratio & bg visibility */}
              <img
                key={imgArray[index]}
                src={imgArray[index].preview || imgArray[index]}
                title={imgArray[index]?.file?.name}
                className="max-h-full max-w-full object-contain rounded-2xl"
                draggable={false}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* right arrow */}
      <button
        onClick={nextImg}
        className="absolute z-10 right-0 bg-transparent text-white w-9 h-9 rounded-full hidden sm:flex items-center justify-center hover:bg-gray-600 text-lg transition duration-100"
      >
        ⟶
      </button>
    </div>
  );
}
