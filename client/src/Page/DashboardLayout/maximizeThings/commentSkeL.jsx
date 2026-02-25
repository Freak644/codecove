export default function CommentSkeleton() {
  return (
    <div className="h-auto mt-2.5 w-full flex items-center flex-col animate-pulse">
      
      {/* Layer One */}
      <div className="flex items-center justify-start w-full">
        
        {/* Avatar + Text */}
        <div className="flex items-start gap-2 w-[93%] p-2">
          
          {/* Avatar */}
          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 shrink-0" />

          {/* Username + Comment */}
          <div className="flex flex-col gap-2 w-full">
            
            {/* Username line */}
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />

            {/* Comment lines */}
            <div className="h-3 w-full bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-4/5 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center flex-col gap-3 w-[7%]">
          <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-5 w-5 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Layer Two */}
      <div className="flex items-center w-full pl-10 mt-2 gap-4">
        <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}