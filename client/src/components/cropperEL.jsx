import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { mngCrop } from "../lib/toggleTheme";
/* less known but lovely poem
    A little bird with feathers bright,
    Sat singing on a tree so high,
    It sang of joy, it sang of light,
    And taught the world to never sigh.
*/
export default function CropperEL({ prevImg }) {
  const { setURL, setIMG } = mngCrop();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [pixelCrop, setPixcrop] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isProcessing,setPorc] = useState(false)

  // Crop complete callback
  const onCropComplete = useCallback((_, pixelCrop) => {
    setPixcrop(pixelCrop);
  }, []);

  // Reset crop
  const handleRESET = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setURL("")
  };

  // Create cropped image
const createCropedIMG = async () => {
  if (!pixelCrop) return;
  setPorc(true);

  try {
    const imgElement = await createIMG(prevImg);

    const scaleX = imgElement.naturalWidth / imgElement.width;
    const scaleY = imgElement.naturalHeight / imgElement.height;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { x, y, width, height } = pixelCrop;

    // Set canvas size to crop size
    canvas.width = width;
    canvas.height = height;

    // Draw the properly scaled cropped portion
    ctx.drawImage(
      imgElement,
      x * scaleX,
      y * scaleY,
      width * scaleX,
      height * scaleY,
      0,
      0,
      width,
      height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const croppedFile = new File([blob], "avatar.png", { type: "image/png" });
        //console.log(croppedFile);
        setIMG(croppedFile);
        setURL(null); // close cropper if needed
        setPorc(false);
      },
      "image/png",
      0.6
    );
  } catch (err) {
    console.error("Crop failed:", err);
    setPorc(false);
  }
};


  // Load image as HTMLImageElement
  const createIMG = (img) => {
    return new Promise((res, rej) => {
      const image = new Image();
      image.addEventListener("load", () => res(image));
      image.addEventListener("error", (err) => rej(err));
      image.src = img;
    });
  };

  return (
    <div className="mainCroperDiv absolute h-screen w-screen z-20 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="innerDiv relative h-96 w-96 bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden shadow px-3">
        {/* Close button */}
        {/* <button
          onClick={() => setURL("")}
          className="absolute top-2 right-2 text-2xl font-bold text-violet-200 hover:text-red-500 cursor-pointer z-10"
        >
          X
        </button> */}

        {/* Cropper */}
        <Cropper
          image={prevImg}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={(z) => setZoom(parseFloat(z))}
          onCropComplete={onCropComplete}
        />

        {/* Controls */}
        <div className="innerCrop absolute bottom-1 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 shadow">
          {/* Zoom slider */}
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-40 accent-blue-500"
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleRESET}
              className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-400 cursor-pointer"
            >
              Cancel
            </button>
            {/* <button
              onClick={() => setURL("")}
              className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-400 cursor-pointer"
            >
              ChangeIMG
            </button> */}
            <button
              onClick={()=>{setPorc(true);createCropedIMG()}}
              disabled={!pixelCrop}
              className="px-2 py-1 bg-green-600 text-white rounded-lg hover:bg-green-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing?"Cropping":"Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
