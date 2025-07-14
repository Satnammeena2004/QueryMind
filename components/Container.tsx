import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const Container = ({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) => {
  return (
    <>
      <header></header>
      <main
        className={cn(
          "dark:bg-gradient-to-r dark:from-black dark:via-transparent dark:to-black min-h-screen",
          className
        )}
      >
        {children}
      </main>
      <footer></footer>
    </>
  );
};

export default Container;
