"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode, useRef, useState } from "react";
import { changeTableName, deleteTable } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TooltipDemo({
  tableId,
  tableName,
}: {
  tableId: string;
  tableName: string;
}) {
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Tooltip>
        <TooltipTrigger>
          <EllipsisVertical />
        </TooltipTrigger>
        <TooltipContent className="flex gap-x-2 bg-transparent border-none">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              dialogTriggerRef.current?.click();

              e.preventDefault();
            }}
            className="p-2 hover:rotate-6 transition-all hover:bg-blue-500  hover:text-white"
          >
            <Edit size={15} />
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteTriggerRef.current?.click();

              e.preventDefault();
            }}
            className="p-2 hover:-rotate-6 transition-all hover:bg-red-600 hover:text-white"
          >
            <Trash size={15} />
          </Button>
        </TooltipContent>
      </Tooltip>
      <DialogDemo tableId={tableId}>
        <Button className="hidden" ref={dialogTriggerRef}></Button>
      </DialogDemo>
      <DialogDelete tableId={tableId} tableName={tableName}>
        <Button className="hidden" ref={deleteTriggerRef}></Button>
      </DialogDelete>
    </div>
  );
}

export function DialogDemo({
  children,
  tableId,
}: {
  children: ReactNode;
  tableId: string;
}) {
  const router = useRouter();
  const [tableName, setTableName] = useState("todos");
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Input
              disabled={isLoading}
              id="name-1"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              name="name"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button ref={cancelRef} type="reset" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                toast.promise(changeTableName(tableId, tableName), {
                  loading: "changing table name...",
                  success: () => {
                    cancelRef.current?.click();
                    router.replace("/own/" + tableName);
                    return `Table name changed succesfully`;
                  },
                  error: (err) => {
                    return err.message;
                  },
                  finally: () => {
                    setIsLoading(false);
                  },
                });
              } catch (error) {
                // console.log(error);
                toast.error("Can't successed this action");
              }
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export function DialogDelete({
  children,
  tableName,
  tableId,
}: {
  children: ReactNode;
  tableId: string;
  tableName: string;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Table</DialogTitle>
          <DialogDescription>Are you sure ?</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button ref={cancelRef} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-red-600 hover:bg-red-500 dark:text-white"
            disabled={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                toast.promise(deleteTable(tableName, tableId), {
                  loading: "Deleting table...",
                  success: () => {
                    cancelRef.current?.click();
                    router.replace("/own");
                    return `table delete succesfully`;
                  },
                  error: (err) => {
                    return err.message;
                  },
                  finally: () => {
                    setIsLoading(false);
                  },
                });
              } catch (error) {
                // console.log(error);
                toast.error("Can't successed this action");
              }
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
