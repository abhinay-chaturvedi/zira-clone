"use client";
import DottedSeperator from "@/components/dotted-seperator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskDescription from "@/features/tasks/components/task-description";
import TaskOverview from "@/features/tasks/components/task-overview";
import { useParams } from "next/navigation";
import React from "react";

const TaskIdClient = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { data, isLoading } = useGetTask({ taskId });
  if (isLoading) {
    return <PageLoader />;
  }
  if (!data) {
    return <PageError message="Task Not found" />;
  }
  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={data.project} task={data} />
      <DottedSeperator className="my-6"/>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={data}/>
        <TaskDescription task={data}/>
      </div>
    </div>
  );
};

export default TaskIdClient;
