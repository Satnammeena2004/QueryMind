import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { File, Table, ArrowDownIcon } from "lucide-react";
import { TooltipDemo } from "./Tooltip";
import { cn } from "@/lib/utils";

export type LinkRow = {
  id: string;
  name: string;
  userId: string;
};

const SideBarLinks = ({
  links,
  tableName,
}: {
  links: LinkRow[];
  tableName: string;
}) => {
  return (
    <div className="mt-10">
      <Link href={"/own"}>
        <Button
          className={cn(
            `w-full`,
            tableName === undefined &&
              "border-b-4 transition-all border-blue-700"
          )}
        >
          <File />
          Upload file
        </Button>
      </Link>
      <ul className="mt-4 flex flex-col justify-center gap-y-2 ">
        <li className="flex items-center gap-x-1">
          <span className="uppercase">data tables</span>
          <ArrowDownIcon size={14} />
        </li>

        {links.map((t, i) => (
          <motion.li
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            key={t.id}
            className={cn(
              `border dark:bg-gradient-to-b flex justify-between px-2 items-center from-transparent  to-zinc-900 dark:text-stone-100 text-zinc-900 w-full ml-3 rounded-md p-2 my-2 text-sm 
        `,
              tableName === t.name
                ? " text-white bg-gradient-to-b from-blue-600  to-blue-800 darkfrom-blue-600  dark:to-blue-800"
                : ""
            )}
          >
            <Link
              className="flex-1 flex justify-between"
              href={"/own/" + t.name}
            >
              <div className="flex gap-x-1 items-center">
                <Table size={14} />
                <span>{t.name}</span>
              </div>
              <TooltipDemo tableId={t.id} tableName={t.name} />
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarLinks;
