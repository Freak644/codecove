export default function NewsSkel() {
  return (
    <>
      {[1,2,3,4,5,6,7,8].map(key => (
        <div 
          key={key}
          className="newsDiv relative w-full h-48 overflow-hidden rounded-md p-2"
        >
          {/* Image skeleton */}
          <div className="w-full h-full bg-gray-700 animate-pulse" />

          {/* Title skeleton overlay */}
          <div
            className="absolute bottom-0 left-0 w-full h-12 
                       bg-gray-600/80 backdrop-blur-sm 
                       animate-pulse"
          />
        </div>
      ))}
    </>
  );
}
