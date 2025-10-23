import { useNavigate } from "react-router-dom";
import "../../assets/style/Error404.css";

export default function NotFound() {
  const navi = useNavigate();

  return (
    <div className="main404 h-screen w-screen flex items-center justify-center bg-[#05080f] relative overflow-hidden">
      {/* subtle blurred glow background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-blue-900/20 blur-3xl" />

      <div className="errorContainer flex items-center gap-24 z-10 flex-row">
        {/* Left Side: Face with Eyes */}
        <div
          className="faceWeye relative h-80 w-[500px] rounded-2xl
          flex items-center justify-center gap-10 p-6
          bg-gradient-to-br from-white/10 via-white/5 to-transparent
          border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.15)]
          backdrop-blur-md"
        >
          <div className="eyesHere bg-white rounded-full shadow-inner shadow-gray-700">
            <div className="pupil-outer">
              <div className="pupil"></div>
            </div>
          </div>
          <div className="eyesHere bg-white rounded-full shadow-inner shadow-gray-700">
            <div className="pupil-outer">
              <div className="pupil"></div>
            </div>
          </div>

          <h1 className="font-extrabold bottom-4 text-4xl text-white absolute tracking-wider drop-shadow-[0_2px_6px_rgba(0,255,255,0.6)]">
            404 Not Found
          </h1>
        </div>

        {/* Right Side: Text */}
        <div
          className="textMSG h-[380px] w-[400px] rounded-2xl flex flex-col
          items-center justify-center text-white gap-4 text-center
          bg-gradient-to-br from-white/10 via-white/5 to-transparent
          border border-cyan-500/20 shadow-[0_0_40px_rgba(0,255,255,0.1)]
          backdrop-blur-md p-6"
        >
          <h1 className="text-9xl big404 border-b border-cyan-800/40 pb-2">
            404
          </h1>
          <p className="text-lg text-gray-300">
            The page you’re looking for <br /> doesn’t exist or was removed.
          </p>
          <button
            onClick={() => navi("/")}
            className="mt-4 bg-gradient-to-br from-cyan-500 to-blue-600 via-pink-400 hover:from-cyan-400 hover:to-blue-500 hover:via-yellow-300
            text-white font-semibold py-2 px-6 rounded-lg shadow-md
            transition-all duration-300 cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
