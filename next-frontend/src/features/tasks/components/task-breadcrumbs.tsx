/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Task } from "../types";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
interface TaskBreadcrumbsProps {
  project: any;
  task: Task;
}
const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  return (
    <div className="flex items-center gap-x-2">
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button className="ml-auto" variant={"destructive"} size={"sm"}>
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

export default TaskBreadcrumbs;
