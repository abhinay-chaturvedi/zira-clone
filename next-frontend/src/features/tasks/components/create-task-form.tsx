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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MemberAvatar from "@/features/members/components/member-avatar";
import { TaskStatus } from "../types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
interface CreateTaskFormProps {
  onCancel?: () => void;
  projectOptions: {id: string, name: string, imageUrl: string}[];
  memberOptions: {id: string, name: string}[]
}
const CreateTaskForm = ({ onCancel, memberOptions, projectOptions }: CreateTaskFormProps) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  console.log(projectOptions[0])
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
        onCancel?.()
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
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>   
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select assignee"/>
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage/>
                      <SelectContent>
                        {memberOptions.map((member) => {
                          return (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-x-2">
                                <MemberAvatar className="size-6" name={member.name}/>
                                {member.name}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                      
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>   
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select status"/>
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage/>
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKlOG}>
                          Backlog
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          In Progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          In Review
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>
                          Todo
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>
                          Done
                        </SelectItem>
                      </SelectContent>
                      
                      </Select>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Assignee</FormLabel>
                      <Select defaultValue={field.value} onValueChange={field.onChange}>   
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="select project"/>
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage/>
                      <SelectContent>
                        {projectOptions.map((project) => {
                          return (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-x-2">
                                <ProjectAvatar className="size-6" name={project.name} image={project.imageUrl}/>
                                {project.name}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                      
                      </Select>
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
