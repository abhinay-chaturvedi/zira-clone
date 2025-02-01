/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeperator from "@/components/dotted-seperator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

// import { toast } from "sonner";
import { useUpdateProject } from "../api/use-update-project";
import { updateProjectSchema } from "../schema";
import { useDeleteProject } from "../api/use-delete-project";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValue: any;
}
const EditProjectForm = ({
  onCancel,
  initialValue,
}: EditProjectFormProps) => {
  console.info(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();
  // const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
  //   useResetInviteCode();
  const router = useRouter();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Project",
    "This action can not be undone!",
    "destructive"
  );
  // const [ResetInviteDialog, confirmResetInvite] = useConfirm(
  //   "Reset invite code",
  //   "This will reset the invite code.",
  //   "destructive"
  // );
  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }
    deleteProject(
      { projectId: initialValue.$id },
      {
        onSuccess: () => {
          router.push(`/workspaces/${initialValue.workspaceId}`);
          router.refresh();
          // window.location.href = "/"
        },
      }
    );
    // console.log("deleting");
  };
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValue,
      image: initialValue.imageUrl,
    },
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    console.log(values, "hi there");
    const finalValues = {
      ...values,
      projectId: initialValue.$id,
    };
    mutate(finalValues, {
      onSuccess: () => {
        form.reset();
        // TODO: Redirect to your new workspace
        // router.push(`/workspaces/${data.$id}`);
      },
    });
  };
  function handleImageChange(e: ChangeEvent<HTMLInputElement>): void {
    // throw new Error("Function not implemented.");
    const file = e.target.files?.[0];
    console.log("executed");
    if (file) {
      form.setValue("image", file);
    }
  }

  
  // const handleResetInviteCode = async () => {
  //   const ok = await confirmResetInvite();
  //   if (!ok) {
  //     return;
  //   }
  //   console.log("restting the invite code");
  //   resetInviteCode(
  //     { param: initialValue.$id },
  //     {
  //       onSuccess: () => {
  //         router.refresh()
  //       },
  //     }
  //   );
  // };
  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog />
      {/* <ResetInviteDialog /> */}
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValue.workspaceId}/projects/${initialValue.$id}`)
            }
          >
            <ArrowLeftIcon />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValue.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter Project name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => {
                    return (
                      <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                                alt="Logo"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p className="text-sm">Project icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG, or JPEG, max 1mb
                            </p>
                            <input
                              onChange={handleImageChange}
                              ref={inputRef}
                              type="file"
                              className="hidden"
                              accept=".jpeg, .png, .jpeg, .svg"
                              disabled={isPending}
                            />
                            <Button
                              type="button"
                              disabled={isPending}
                              size="sm"
                              className="w-fit mt-2"
                              onClick={() => inputRef.current?.click()}
                            >
                              Upload image
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
              <DottedSeperator className="py-7" />
              <div className="flex items-center justify-between">
                <Button
                  disabled={isPending}
                  type="button"
                  size={"lg"}
                  variant={"secondary"}
                  onClick={onCancel}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button disabled={isPending} type="submit" size={"lg"}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground">
              Deleting a Project is irreversible and will remove all
              associated data.{" "}
            </p>
            <DottedSeperator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant={"destructive"}
              type="button"
              onClick={handleDelete}
              disabled={isDeletingProject}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProjectForm;
