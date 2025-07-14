"use client";

import { CircleCheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { ShinyButton } from "./magicui/shiny-button";
import DialogCard from "./DialogCard";

type PricePlanProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
};

const Nothing = () => {
  return <></>;
};

const PriceplanCard = ({
  description,
  features,
  title,
  price,
}: PricePlanProps) => {
  const session = useSession();
  return (
    <Card
      className={cn(
        "flex-1 rounded-lg md:max-w-[35rem] mx-auto md:mx-0  relative bg-transparent backdrop-blur-md",
        title === "Professional" && "lg:-translate-y-6"
      )}
    >
      <CardHeader className="flex flex-col gap-y-4">
        <CardTitle>{title}</CardTitle>
        <p className=" my-6">
          <span className="text-4xl">{price}</span>
          <span>/month</span>
        </p>
        <CardDescription>{description}</CardDescription>
        <DialogCard
          DialodContent={Nothing}
          title={title !== "Free" ? `Upgrade to ${title}` : "Current"}
          description={
            title !== "Free"
              ? `Sorry ! it not available right now`
              : "You are using free trial"
          }
        >
          <ShinyButton
            className={cn(
              "my-4",
              `${
                session.status === "authenticated" &&
                title === "Free" &&
                "dark:bg-zinc-800 border bg-zinc-700 *:text-white  dark:text-white dark:hover:bg-zinc-900"
              }`
            )}
          >
            {session.status === "unauthenticated"
              ? `${title == "Free" ? "Start" : "Sign Up"} for ${title}`
              : title == "Free"
              ? "Free"
              : `Upgrade to ${title}`}
          </ShinyButton>
        </DialogCard>
      </CardHeader>
      <div className="px-4">
        <div className="border my-3"></div>
      </div>
      <CardContent>
        <ul>
          {features.map((feature) => {
            return (
              <li className="flex items-center gap-x-2 opacity-80 font-light my-0.5">
                <CircleCheckIcon size={12} />{" "}
                <span className="text-sm text-nowrap">{feature}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PriceplanCard;
