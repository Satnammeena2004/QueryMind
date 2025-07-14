"use client";
import { AwardIcon, FileCode2, Info, LoaderIcon, Table } from "lucide-react";
import {
  callTheActionsInTransations,
  checkCredits,
  customRevalidatePath,
} from "@/app/actions";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const USER_FREE_CREDITS_LITMIT =
  process.env.NEXT_PUBLIC_USER_FREE_CREDITS_LITMIT;

export function FilePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState(
    "Error in Generating or creating table in database"
  );
  const [userTableCount, setUserTableCount] = useState<number>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingDialogCloseRef = useRef<HTMLButtonElement>(null);
  const errorDialogButtonTriggerRef = useRef<HTMLButtonElement>(null);
  async function userCredits() {
    const credits = await checkCredits();
    setUserTableCount(parseInt(credits as string));
    return credits;
  }

  useEffect(() => {
    userCredits();
  }, []);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setFile(event.target.files?.[0]);
      // console.log(event.target.files[0].size);
      if (event.target.files[0].size > 10000) {
        setError(true);
        setErrorMessage("File size is not more than 10KB");
        errorDialogButtonTriggerRef.current?.click();
      }
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  async function handleUpload() {
    if (error) {
      setErrorMessage("There is an error.Not allowed to upload");
      return;
    }
    try {
      const totalTables = await checkCredits();
      const remainingCredits =
        parseInt(USER_FREE_CREDITS_LITMIT as string) - parseInt(totalTables);
      if (remainingCredits <= 0) {
        setErrorMessage("Your credits are exceed");
        errorDialogButtonTriggerRef.current?.click();
        return;
      }
      if (file) {
        const reader = new FileReader();

        reader.onload = async (e) => {
          let tid;
          try {
            const fileContent = e.target?.result;
            tid = toast.loading("Creating or inserting data");

            await callTheActionsInTransations(fileContent as string);
            toast.success("Let's gooo!");
          } catch (error: any) {
            // console.log("Errorn", error);
            setError(true);
            setErrorMessage(error.message);
            errorDialogButtonTriggerRef.current?.click();
          } finally {
            await customRevalidatePath("/own");
            toast.dismiss(tid);
            loadingDialogCloseRef.current?.click();
          }
        };
        reader.onerror = (e) => {
          console.error("Error reading file:", e);
          errorDialogButtonTriggerRef.current?.click();
          return null;
        };
        reader.readAsText(file);
      }
    } catch (error) {
      if (error instanceof Error) {
        // console.log("error", error);
        
        setError(true);
        setErrorMessage(error.message as string);
        errorDialogButtonTriggerRef.current?.click();
      }
    }
  }

  const handleCancel = () => {
    setFile(null);
  };
  function handleErrorDialogClose() {
    setFile(null);
    setError(false);
  }

  const getFileIcon = (file: File) => {
    if (file.name.endsWith(".json"))
      return <FileCode2 className="w-5 h-5 text-yellow-600 text-primary" />;
    if (file.name.endsWith(".csv"))
      return <Table className="w-5 h-5 text-green-600" />;
    return <FileQuestion />; // fallback in case something slips through
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center w-full h-full min-h-[300px] p-4 relative"
    >
      <Card className="w-full relative max-w-xl p-6 rounded-2xl shadow-md">
        <CardContent className="flex flex-col items-center justify-between gap-4 text-center">
          {file && (
            <div className="w-full mt-4 text-left flex items-center justify-between gap-y-4 flex-wrap gap-x-6">
              <div>
                <p className="text-[10px] font-thin my-2 flex gap-x-1 items-center">
                  <Info size={12} /> <span>maximum size of file is 10KB</span>
                </p>
                <p className="text-sm font-medium">Select File:</p>
                <ul className="mt-1 space-y-2 text-sm text-muted-foreground">
                  <li key={file.name} className="flex items-center gap-2">
                    {getFileIcon(file)}
                    <span>{file.name}</span>
                    <span>{Math.round(file.size / 1000)}KB</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-x-2 items-center">
                <Dialog>
                  <DialogTitle className="sr-only">WAIT !</DialogTitle>
                  <DialogTrigger>
                    <Button
                      onClick={handleUpload}
                      variant="default"
                      size="sm"
                      className={cn(loading && "cursor-not-allowed")}
                      disabled={loading}
                    >
                      Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    disableCrossButton={true}
                    onEscapeKeyDown={(event) => event.preventDefault()}
                    onInteractOutside={(event) => event.preventDefault()}
                  >
                    <div className="flex items-center gap-x-2">
                      <LoaderIcon className="animate-spin" />
                      <p className="text-gray-200">
                        Generating and creating table in database !
                      </p>
                    </div>
                  </DialogContent>
                  <DialogClose ref={loadingDialogCloseRef} className="hidden" />
                </Dialog>
                <Button
                  onClick={handleCancel}
                  variant="destructive"
                  size="sm"
                  className=" "
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <Dialog
            onOpenChange={(isOpened) => {
              if (!isOpened) {
                setFile(null);
                setError(false);
              }
            }}
          >
            <DialogTitle className=" sr-only">ERROR !</DialogTitle>
            <DialogTrigger>
              <Button ref={errorDialogButtonTriggerRef} className="hidden" />
            </DialogTrigger>
            <DialogContent>
              <div className="flex items-center gap-x-2">
                <Info className="text-red-500" />
                <p className="text-gray-200">{errorMessage}</p>
              </div>
              <DialogClose>
                <Button
                  onClick={handleErrorDialogClose}
                  variant={"outline"}
                  size={"lg"}
                >
                  Retry
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <div className="flex flex-col justify-center items-center gap-y-3 my-6">
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full"
            >
              {/* <iframe src="https://lottie.host/embed/49665283-6bc8-4321-96fa-885c2484d865/0rzApqzOD3.lottie"></iframe> */}
              <Button
                variant="secondary"
                size="lg"
                className="w-full p-3"
                onClick={handleButtonClick}
                disabled={loading}
              >
                Select JSON or CSV File
              </Button>
            </motion.div>
            <Input
              type="file"
              accept=".json,.csv"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
