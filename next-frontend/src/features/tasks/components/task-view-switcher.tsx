"use client";
import DottedSeperator from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCreateTaskModal from "@/features/hooks/use-create-task-modal";
import { Loader, PlusIcon } from "lucide-react";
import React from "react";
import { useGetTasks } from "../api/use-get-tasks";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import DataFilters from "./data-filters";
import useTaskFilters from "@/features/hooks/use-task-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const TaskViewSwitcher = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [{ status, assigneeId, projectId, dueDate }] =
    useTaskFilters();
  const { data: tasks, isPending: isTasksLaoding } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId,
    dueDate
  });
  const { open } = useCreateTaskModal();
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });
  console.log("TaskViewSwitcher");
  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size={"sm"} className="w-full lg:w-auto">
            <PlusIcon />
            New
          </Button>
        </div>
        <DottedSeperator className="my-4" />
         <DataFilters/>
        <DottedSeperator className="my-4" />
        {isTasksLaoding ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col justify-center items-center">
            <Loader className="size-5 animate-spin text-muted-foreground"/>
          </div>
        ) : (
          <>
            <TabsContent value="table">
              <DataTable columns={columns} data={tasks?.documents ?? []}/>
            </TabsContent>
            <TabsContent value="kanban">{JSON.stringify(tasks)}</TabsContent>
            <TabsContent value="calendar">{JSON.stringify(tasks)}</TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
