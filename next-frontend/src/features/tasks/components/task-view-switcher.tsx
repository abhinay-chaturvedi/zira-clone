"use client";
import DottedSeperator from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCreateTaskModal from "@/features/hooks/use-create-task-modal";
import { PlusIcon } from "lucide-react";
import React from "react";

const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal();
  console.log("TaskViewSwitcher");
  return (
    <Tabs className="flex-1 w-full border rounded-lg">
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
        Data Filters
        <DottedSeperator className="my-4" />
        <>
          <TabsContent value="table">Data Table</TabsContent>
          <TabsContent value="kanban">Kanban Board</TabsContent>
          <TabsContent value="calendar">Calendar</TabsContent>
        </>
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
