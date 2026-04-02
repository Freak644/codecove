export default function MergeAccountSkeleton() {
  return (
    <div className="h-4/5 rounded-lg flex items-center justify-center bg-gray-800 px-4 animate-pulse">
      
      <div className="max-w-md w-full bg-black shadow-lg rounded-2xl p-8">

        {/* Header */}
        <div className="text-center">
          
          {/* Avatar */}
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gray-700" />

          {/* Title */}
          <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto" />

          {/* Description */}
          <div className="mt-3 space-y-2">
            <div className="h-3 bg-gray-700 rounded w-full mx-auto" />
            <div className="h-3 bg-gray-700 rounded w-5/6 mx-auto" />
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="h-3 bg-gray-700 rounded w-2/3" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>

        {/* Buttons */}
        <div className="mt-6 space-y-3">
          <div className="h-10 bg-gray-700 rounded-lg w-full" />
          <div className="h-10 bg-gray-700 rounded-lg w-full" />
        </div>

        {/* Footer */}
        <div className="mt-6 h-3 bg-gray-700 rounded w-1/2 mx-auto" />

      </div>
    </div>
  );
}
