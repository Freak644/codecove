export default function MenuSkeleton() {
  return (
    <div className="menuDiv relative left-0 border-r h-[91vh] border-gray-400 lg:h-[93.5vh] w-[13vw]
      flex items-center flex-col gap-5
      bg-blue-800/10 backdrop-blur-lg overflow-hidden">

      {/* Logo Area */}
      <div className="Logotxt flex items-center lg:mt-3.5! flex-col w-[120px]">
        <div className="h-12 w-12 rounded-xl bg-gray-500/20 animate-pulse"></div>
        <div className="h-5 w-24 rounded-md bg-gray-500/20 mt-3 animate-pulse"></div>
      </div>

      {/* Menu Container */}
      <div className="menuContainer flex items-center flex-col gap-10 lg:text-[18px] sm:text-2xl text-skin-text">

        {/* Top menu skeleton list */}
        <ul className="topU flex items-start flex-col gap-5 border-b-2 border-gray-400 pb-2">
          {Array(6).fill(0).map((_, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-md bg-gray-500/20 animate-pulse"></div>
              <div className="h-4 w-24 rounded-md bg-gray-500/20 animate-pulse"></div>
            </li>
          ))}

          {/* Profile icon */}
          <li className="flex items-center gap-3">
            <div className="imgDiv h-8 w-8 md:h-9 md:w-9 rounded-full bg-gray-500/20 animate-pulse"></div>
            <div className="h-4 w-20 rounded-md bg-gray-500/20 animate-pulse"></div>
          </li>
        </ul>

        {/* Bottom section */}
        <ul className="secul flex items-start flex-col gap-5">
          {/* Setting */}
          <li className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-gray-500/20 animate-pulse"></div>
            <div className="h-4 w-20 rounded-md bg-gray-500/20 animate-pulse"></div>
          </li>

          {/* Tools */}
          <li className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-md bg-gray-500/20 animate-pulse"></div>
            <div className="h-4 w-20 rounded-md bg-gray-500/20 animate-pulse"></div>
          </li>
        </ul>

      </div>
    </div>
  );
}
