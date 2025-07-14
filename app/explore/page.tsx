import CustomWrapper from "@/components/CustomWrapper";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: { absolute: "unicorns" },
};
export default function Page() {
  return <CustomWrapper isCustom={false} />;
}
