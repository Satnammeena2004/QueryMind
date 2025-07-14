"use client";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Link from "next/link";

export function RainbowButtonDemo({
  dark,
  content,
}: {
  dark: boolean;
  content: string;
}) {
  return (
    <Link href={"/explore"}>
      <RainbowButton >{content}</RainbowButton>
    </Link>
  );
}
