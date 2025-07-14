import { SkeletonCard } from "@/components/skeleton-card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className=" dark:bg-gradient-to-r dark:from-black dark:via-transparent dark:to-black flex items-start justify-center p-0 sm:p-8">
      <div className="w-full   max-w-5xl min-h-dvh sm:min-h-0 flex flex-col mt-12">
        <Skeleton className="h-[300px]" />
        <div className="flex gap-x-6">

        <Skeleton className="h-[30px] flex-1 mt-10" />
        <Skeleton className="h-[30px] mt-10" />
        </div>
        <div className="flex flex-wrap">
        <Skeleton className="h-[20px]" />
        <Skeleton className="h-[20px]" />
        <Skeleton className="h-[20px]" />
        <Skeleton className="h-[20px]" />
        <Skeleton className="h-[20px]" />
        <Skeleton className="h-[20px]" />
        <Skeleton className="h-[20px]" />

        </div>
      </div>
    </div>
  );
};

export default Loading;
