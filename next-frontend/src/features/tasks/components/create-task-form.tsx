"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
// import { createProjectSchema } from "../schema";
import { createTaskSchema } from "../schema";
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
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCreateTask } from "../api/use-create-task";
import DatePicker from "@/components/date-picker";
interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: {id: string, name: string, imageUrl: string}[];
  memberOptions: {id: string, name: string}
}
const CreateTaskForm = ({ onCancel }: CreateTaskFormProps) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCreateTask();
  // const router = useRouter();
  const { workspaceId } = useParams<{workspaceId: string}>();
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId,
    },
  });
  
  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    console.log(values);
    const finalValues = {
      ...values,
      workspaceId
    }
    mutate(finalValues, {
      onSuccess: () => {
        form.reset();
        // TODO: Redirect to your new task screen
      },
    });
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new task
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
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter task name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        {/* TODO: Create Date picker */}
                        {/* <Input {...field} placeholder="Enter task name" /> */}
                        <DatePicker {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
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
                Create task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
