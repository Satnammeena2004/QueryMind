import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function ShimmerAtomicButton() {
  return (
    <ShimmerButton className="shadow-2xl mt-4" shimmerColor="#ffffff">
      <span className="whitespace-pre-wrap text-gray-300 text-center text-sm font-medium leading-none tracking-tight text-whsite dark:from-white dark:to-slate-900/10 lg:text-lg">
        Shimmer Button
      </span>
    </ShimmerButton>
  );
}
