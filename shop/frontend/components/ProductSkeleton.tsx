"use client";
export default function ProductSkeleton() {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden animate-pulse flex flex-col">
      <div className="h-48 bg-gray-700" />
      <div className="p-4 flex-1 space-y-3">
        <div className="h-3 bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-700 rounded w-4/5" />
        <div className="h-5 bg-gray-700 rounded w-1/4 mt-2" />
      </div>
      <div className="px-4 pb-4">
        <div className="h-9 bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}
