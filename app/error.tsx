"use client"; // Error components must be Client Components
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import Section from "@/components/Section";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <Section type="b " className="h-screen">
      <div className="flex justify-center flex-col items-center w-ful h-full ">
        <TriangleAlert color="red" size={40} />
        <h2 className="sm:text-4xl my-4 ">Unexpected server Error!</h2>
        <p>{error.message}</p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </Section>
  );
}
