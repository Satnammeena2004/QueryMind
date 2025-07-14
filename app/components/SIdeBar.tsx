"use client";

import { Home, List, ListCollapse } from "lucide-react";
import { useState } from "react";
import SideBarLinks, { LinkRow } from "./SideBarLinks";
import { AnimatePresence, motion, VariantLabels } from "framer-motion";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

const ThunderLightingSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-2"
      viewBox="0 0 320 512"
    >
      <path
        fill="#FFD43B"
        d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z"
      />
    </svg>
  );
};
const USER_FREE_CREDITS_LITMIT =
  process.env.NEXT_PUBLIC_USER_FREE_CREDITS_LITMIT;
const Sidebar = ({ links }: { links: LinkRow[] }) => {
  const session = useSession();
  const { tableId } = useParams();
  const remainingCredits =
    parseInt(USER_FREE_CREDITS_LITMIT as string) - links.length;
  const [isCollapsed, setIsCollapse] = useState(true);
  function handleCollapse() {
    setIsCollapse((is) => !is);
  }


  return (
    <AnimatePresence initial={false}>
      <motion.div
        className={`${
          isCollapsed
            ? "border-r h-full min-w-64 overflow-y-scroll overflow-x-hidden"
            : "border-no rounded-md"
        }  flex flex-col absolute left-0 backdrop-blur-md z-10  lg:static lg:h-screen    dark:bg-[#00000063] [&::-webkit-scrollbar]:w-[2px]
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-zinc-950
  dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600`}
      >
        {/* Toggle Button */}

        <div className="p-4  flex justify-between items-center px-2 ">
      
          <Button className="bg-transparent hover:bg-transparent">
            {isCollapsed ? (
              <List
                onClick={handleCollapse}
                className="dark:text-white text-zinc-950"
              />
            ) : (
              <ListCollapse
                onClick={handleCollapse}
                className="dark:text-white text-zinc-950"
              />
            )}
          </Button>
          <Tooltip>
            <TooltipTrigger>
              <Button
                className="bg-transparent hover:bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <ThunderLightingSvg />
                <span className="dark:text-white text-black">
                  {remainingCredits}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col text-xs">
                {remainingCredits <= 0 ? (
                  <>
                    <p className="text-red-700">Alert !</p>
                    <p>Join premium.You exceed the credits </p>
                  </>
                ) : (
                  <>
                    <p>You have {remainingCredits} credits left.</p>
                    <p>One credit per table.</p>
                  </>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        {isCollapsed && (
          <motion.div
            key="sidebar-content"
            initial={{ transform: "translateX(-300px)", opacity: 0 }}
            animate={{ transform: "translateX(0px)", opacity: 1 }} // Customize width
            exit={{ transform: "translateX(-300px)", opacity: 0 }}
            transition={{ duration: 0.3 }}
            className=" px-8 py-4 flex flex-col"
          >
            <h4 className="">
              <Link
                href={"/"}
                className="whitespace-nowrap w-48 gap-x-2 flex items-center"
              >
                <Home size={16} />{" "}
                <span>
                  {" "}
                  {session.data?.user.name?.split(" ")[0]}'s dashboard{" "}
                </span>
              </Link>
            </h4>
            <SideBarLinks links={links} tableName={tableId as string} />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;
