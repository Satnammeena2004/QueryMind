import { DynamicChart } from "@/components/dynamic-chart";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { QueryViewer } from "@/components/query-viewer";
import { RainbowButtonDemo } from "@/components/RainbowButton";
import Section from "@/components/Section";
import {
  ExampleInitialQuery,
  exampleResults,
  suggestionQueries,
} from "@/lib/helper";
import Link from "next/link";
import AuthButton from "./components/AuthButton";
import { ChartContainer } from "@/components/ui/chart";
import { Meteors } from "@/components/magicui/meteors";
import { MarqueeDemo } from "@/components/MarqueeDemo";
import PricePlans from "@/components/PricePlans";
import SocialLinks from "@/components/SocialLinks";

export default async function Page() {
  return (
    <>
      <main className="flex flex-col justify-center items-center dark:bg-gradient-to-r dark:from-black dark:via-transparent dark:to-black">
        <AuthButton />
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg dark:bg-gradient-to-t from-transparent  to-black/50 sm:p-14">
          <Meteors number={30} />
          <h1 className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl sm:text-6xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/20">
            Talk to Your Data in <br />{" "}
            <AuroraText className="font-semibold text-4xl sm:text-5xl">
              Netural language
            </AuroraText>
          </h1>
          <div className="flex gap-x-8 items-center my-12">
            {/* <ShimmerAtomicButton/> */}
            <Link href={"/own"}>
              <ShinyButton>Use Own Data</ShinyButton>
            </Link>
            <RainbowButtonDemo content="Explore" dark={false} />
          </div>
        </div>
        <div className="my-4 w-full p-2  no-scrollbar">
          <Section
            className="min-h-60  w-full my-10 px-4 gap-x-3 py-10 sm:py-20 "
            type="t"
          >
            <div className="">
              <h1 className="pointer-events-none text-center whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-6xl  sm:text-6xl font-semibold leading-none  dark:text-gray-300/80 ">
                Write your query in <br />{" "}
                <AuroraText
                  className="text-4xl sm:text-5xl -translate-y-10 sm:translate-y-0"
                  colors={[
                    "#0EA5E9",
                    "#A21CAF",
                    "#CA8A04",
                    "#16A34A",
                    "#DB2777",
                    "#3B82F6",
                  ]}
                >
                  Simple Language
                </AuroraText>
              </h1>
              <div className="flex justify-between md:px-10 py-10 sm:py-20">
                <MarqueeDemo queries={suggestionQueries} />
              </div>
            </div>
          </Section>
          <Section
            className="min-h-60  w-full my-10 px-4 gap-x-3 py-20 "
            type="t"
          >
            <div className="flex flex-col items-center justify-center ">
              <h1 className="pointer-events-none  whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-5xl  sm:text-6xl font-semibold leading-none  dark:text-gray-300 text-center my-16 ">
                Convert Your Query into Graph
              </h1>
              <div className="flex flex-col">
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border rounded-full my-4 text-center">
                  <span className="">
                    ✨ Compare count of unicorns in SF and NY over time
                  </span>
                </AnimatedShinyText>

                <div className="w-full">
                  {exampleResults?.map((result, i) => (
                    <ChartContainer
                      className="w-96 sm:w-full px-4"
                      config={result.config}
                      key={i}
                    >
                      <DynamicChart
                        chartData={result.data}
                        chartConfig={result.config}
                      />
                    </ChartContainer>
                  ))}
                </div>
              </div>
            </div>
          </Section>
          <Section
            className="min-h-60  w-full my-10 px-4 gap-x-3 py-20 "
            type="t"
          >
            <div className="flex flex-col items-center justify-center ">
              <h1 className="pointer-events-none  whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-5xl sm:text-6xl font-semibold leading-none  dark:text-gray-300 text-center my-20 ">
                Exaplain Your{" "}
                <AuroraText
                  colors={[
                    "#E11D48",
                    "#9333EA",
                    "#2563EB",
                    "#FACC15",
                    "#4ADE80",
                    "#F43F5E",
                  ]}
                >
                  Query
                </AuroraText>
              </h1>
              <div className="flex flex-col">
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border rounded-full my-4 text-center">
                  <span>
                    ✨ Compare count of unicorns in SF and NY over time
                  </span>
                </AnimatedShinyText>
                <div className="sm:w-2/3 mx-auto relative">
                  <QueryViewer
                    activeQuery={ExampleInitialQuery.activeQuery}
                    inputValue={ExampleInitialQuery.inputValue}
                  />
                </div>
              </div>
            </div>
          </Section>
          <PricePlans />
        </div>
      </main>
      <footer>
        <SocialLinks />
      </footer>
    </>
  );
}
