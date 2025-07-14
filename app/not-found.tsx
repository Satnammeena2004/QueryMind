import Section from "@/components/Section";
import Link from "next/link";

export default function NotFound() {
  return (
    <Section type="b" className=" w-full h-screen border">
    <div className="flex my-auto justify-center flex-col items-center bg-transparent w-ful h-full ">
      <h2 className="text-4xl">404</h2>
      <p className="text-sm">Could not find requested resource</p>
      <Link href="/" className="underline text-blue-500">Return Home</Link>
    </div>
    </Section>
  );
}
