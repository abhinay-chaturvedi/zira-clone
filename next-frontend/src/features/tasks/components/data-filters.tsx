/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { FoldersIcon, ListChecksIcon, UserIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { TaskStatus } from "../types";
import useTaskFilters from "@/features/hooks/use-task-filters";
import DatePicker from "@/components/date-picker";
interface DataFiltersProps {
  hideProjectFilter?: boolean;
}
const DataFilters = ({hideProjectFilter}: DataFiltersProps) => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: projects, isPending: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isPending: isMembersLoading } = useGetMembers({
    workspaceId,
  });
  const isLoading = isMembersLoading || isProjectsLoading;

  const projectOptions = projects?.documents.map((project: any) => {
    return {
      value: project.$id,
      label: project.name,
    };
  });
  const memberOptions = members?.documents.map((member: any) => {
    return {
      value: member.$id,
      label: member.name,
    };
  });
  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();
  const onStatusChange = (value: string) => {
    if (value == "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };
  const onAssigneeChange = (value: string) => {
    if (value == "all") {
      setFilters({ assigneeId: null });
    } else {
      setFilters({ assigneeId: value as string });
    }
  };
  const onProjectChange = (value: string) => {
    if (value == "all") {
      setFilters({ projectId: null });
    } else {
      setFilters({ projectId: value as string });
    }
  };
  if (isLoading) return null;
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKlOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member: any) => {
            return (
              <SelectItem key={member.value} value={member.value}>
                {member.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {!hideProjectFilter && <Select
        defaultValue={projectId ?? undefined}
        onValueChange={onProjectChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <FoldersIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectSeparator />
          {projectOptions?.map((project: any) => {
            return (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>}
      <DatePicker
        placeHolder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};

export default DataFilters;
