"use client";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import TaskBreadcrumbs from "@/features/tasks/components/task-breadcrumbs";
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
    </div>
  );
};

export default TaskIdClient;
