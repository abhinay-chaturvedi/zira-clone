/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import CreateTaskForm from "./create-task-form";
import { useGetTask } from "../api/use-get-task";
interface EditTaskFormWrapperProps {
  onCancel: () => void;
  id: string;
}
const EditTaskFormWrapper = ({ onCancel, id }: EditTaskFormWrapperProps) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: initialValues, isLoading: isTaskLoading } = useGetTask({
    taskId: id,
  });
  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });
  const projectOptions = projects?.documents.map((project: any) => {
    return {
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
    };
  });
  const memberOptions = members?.documents.map((member: any) => {
    return {
      id: member.$id,
      name: member.name,
    };
  });
  const isLoading = isProjectsLoading || isMembersLoading || isTaskLoading;
  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }
  if(!initialValues) {
    return null;
  }
  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
    />
  );
};

export default EditTaskFormWrapper;
