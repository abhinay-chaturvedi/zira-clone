"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { createWorkSpaceSchema } from "../schemas";
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
import { useCreateWorkspace } from "../api/use-create-workspaces";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}
const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreateWorkspace();
  const router = useRouter();

  const form = useForm<z.infer<typeof createWorkSpaceSchema>>({
    resolver: zodResolver(createWorkSpaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkSpaceSchema>) => {
    console.log(values);
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(finalValues, {
      onSuccess: ({ data }) => {
        form.reset();
        // TODO: Redirect to your new workspace
        router.push(`/workspaces/${data.$id}`)
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
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
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
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter Workspace name" />
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
                          <p className="text-sm">Workspace icon</p>
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
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateWorkspaceForm;
