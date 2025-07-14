"use client";
import { authorsSocialLinks } from "@/lib/helper";
import { ReactNode } from "react";
import Section from "./Section";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CornerRightDown } from "lucide-react";

export type SocialLink = {
  icon: ReactNode;
  name: string;
  url: string;
};

const SocialLinks = () => {
  const { theme } = useTheme();
  return (
    <Section type="b" className="relative flex">
       
        <div className="flex justify-center gap-x-3 p-4 mx-auto">
          {authorsSocialLinks.map((social) => {
            return (
              <motion.a
                href={social.url}
                target="_blank"
                whileHover={{ y: -10, margin: "0,4" }}
                title={social.name}
                className="size-8 rounded-full  p-2 flex justify-center items-center border border-zinc-950 dark:border-none dark:bg-zinc-900"
              >
                {
                  <social.icon
                    size={12}
                    fillOpacity={0.7}
                    fill={theme === "dark" ? "white" : "black"}
                  />
                }
              </motion.a>
            );
          })}
      </div>
    </Section>
  );
};

export default SocialLinks;
