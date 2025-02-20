/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Analytics from "@/components/analytics";
import DottedSeperator from "@/components/dotted-seperator";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCreateProjectModal from "@/features/hooks/use-create-project-modal";
import useCreateTaskModal from "@/features/hooks/use-create-task-modal";
import { useGetMembers } from "@/features/members/api/use-get-members";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Member } from "@/features/members/types";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { Task } from "@/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const WorkspaceIdClient = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;
  if (isLoading) return <PageLoader />;

  if (!analytics || !projects || !tasks || !members) {
    return <PageError message="Failed to load workspace data." />;
  }
  return (
    <div className="h-full flex flex-col space-y-4">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList
          tasks={tasks.documents}
          total={tasks.total}
          workspaceId={workspaceId}
        />
        <ProjectList
          projects={projects.documents}
          total={projects.total}
          workspaceId={workspaceId}
        />
        <MembersList
          members={members.documents}
          total={members.total}
          workspaceId={workspaceId}
        />
      </div>
    </div>
  );
};

export default WorkspaceIdClient;

export const TaskList = ({
  tasks,
  total,
  workspaceId,
}: {
  tasks: Task[];
  total: number;
  workspaceId: string;
}) => {
  const { open: createTask } = useCreateTaskModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button size={"icon"} onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeperator className="my-4" />

        <ul className="flex flex-col gap-y-4">
          {tasks.map((task) => {
            return (
              <li key={task.$id}>
                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4">
                      <p className="text-lg font-medium truncate">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <p>{task.project?.name}</p>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-sm text-muted-foreground flex items-center">
                          <CalendarIcon className="size-3 mr-1" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.dueDate))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No tasks found
          </li>
        </ul>
        <Button variant={"outline"} asChild className="mt-4 w-full">
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
};
export const ProjectList = ({
  projects,
  total,
  workspaceId,
}: {
  projects: any[];
  total: number;
  workspaceId: string;
}) => {
    const { open: createProject } = useCreateProjectModal();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button size={"icon"} variant={"secondary"} onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeperator className="my-4" />

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => {
            return (
              <li key={project.$id}>
                <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                  <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                    <CardContent className="p-4 flex items-center gap-x-2.5">
                      <ProjectAvatar name={project.name} image={project.imageUrl} className="size-12" fallbackClassname="text-lg"/>
                      <p className="text-lg font-medium truncate">{project.name}</p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Projects found
          </li>
        </ul>
      </div>
    </div>
  );
};
export const MembersList = ({
  members,
  total,
  workspaceId
}: {
  members: Member[];
  total: number;
  workspaceId: string;
}) => {
    
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button size={"icon"} variant={"secondary"} asChild >
            <Link href={`/workspaces/${workspaceId}/members`}>
            <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeperator className="my-4" />

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            return (
              <li key={member.$id}>
                
                  <Card className="shadow-none rounded-lg overflow-hidden">
                    <CardContent className="p-3 flex flex-col items-center gap-x-2">
                      <MemberAvatar name={member.name} className="size-12" />
                      <div className="flex flex-col items-center overflow-hidden">
                      <p className="text-lg font-medium line-clamp-1">{member.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{member.name}</p>
                      </div>
                    </CardContent>
                  </Card>
              </li>
            );
          })}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No Members found
          </li>
        </ul>
      </div>
    </div>
  );
};
