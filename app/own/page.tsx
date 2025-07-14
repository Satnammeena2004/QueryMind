import Container from "@/components/Container";
import  { FilePicker } from "@/components/FileInput";




const Page = async () => {
  return (
    <div className="flex flex-col gap-y-4 p-4 sm:p-20  translate-y-20 sm:translate-y-0">
      <FilePicker/>
    </div>
  );
};

export default Page;
