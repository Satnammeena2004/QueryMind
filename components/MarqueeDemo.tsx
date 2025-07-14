import { AnimatedShinyText } from "./magicui/animated-shiny-text";
import { Marquee } from "./magicui/marquee";

export function MarqueeDemo({ queries }: { queries: any[] }) {
  const firstRow = queries.slice(0, queries.length / 2);
  const secondRow = queries.slice(queries.length / 2);
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s] marquee">
        {firstRow.map((query) => (
          <>
            <AnimatedShinyText className="inline-flex sm:hidden items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border rounded-full my-4 text-center w-full text-nowrap">
              <span>✨{query.mobile}</span>
            </AnimatedShinyText>
            <AnimatedShinyText className="hidden sm:inline-flex  items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border rounded-full my-4 text-center w-full">
              <span>✨{query.desktop}</span>
            </AnimatedShinyText>
          </>
        ))}
      </Marquee>
      <Marquee reverse className="[--duration:20s]">
        {secondRow.map((query) => (
          <>
            <AnimatedShinyText className="inline-flex sm:hidden items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border rounded-full my-4 text-center w-full text-nowrap">
              <span>✨{query.mobile}</span>
            </AnimatedShinyText>
            <AnimatedShinyText className="hidden sm:inline-flex  items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border rounded-full my-4 text-center w-full">
              <span>✨{query.desktop}</span>
            </AnimatedShinyText>
          </>
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
