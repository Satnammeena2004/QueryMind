"use client";
import { motion, useAnimate, useAnimation, useInView } from "motion/react";
import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
const Section = ({
  children,
  type,
  className,
}: {
  children?: ReactNode;
  type: string;
  className?: string;
}) => {
  const ref = useRef(null);
  const sectionControl = useAnimation();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      // 
      // ("In isnView")
      sectionControl.start("visible");
    }
  }, [isInView]);

  return (
    <motion.div
    ref={ref}
      variants={{
        hidden: { opacity: 0, y: 75 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={sectionControl}
      transition={{
        duration: 0.5,
        delay: 0.25,
      }}
      className={cn(
        `${
          type === "b" ? "dark:bg-gradient-to-b" : "dark:bg-gradient-to-t"
        } from-transparent  to-black/50 rounded-lg`,
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Section;
