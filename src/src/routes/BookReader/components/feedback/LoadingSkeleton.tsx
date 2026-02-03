import '../../styles/micro-interactions.css'

export function LoadingSkeleton(): JSX.Element {
  return (
    <div className="a4-page shadow-2xl mx-auto my-8 bg-white p-[2.5cm] relative overflow-hidden" style={{ minHeight: '297mm' }}>
      <div className="animate-pulse space-y-4">
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-8"></div>
        
        {/* Paragraph skeletons */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        
        <div className="space-y-2">
           <div className="h-4 bg-gray-200 rounded w-full"></div>
           <div className="h-4 bg-gray-200 rounded w-full"></div>
           <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

         {/* Image placeholder */}
        <div className="h-48 bg-gray-200 rounded w-full my-6"></div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
      
      {/* Shimmer overlay */}
      <div className="skeleton-shimmer absolute inset-0"></div>
    </div>
  )
}
