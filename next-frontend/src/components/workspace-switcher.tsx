/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import React from "react";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useParams, useRouter } from "next/navigation";
import useCreateWorkspaceModal from "@/features/hooks/use-create-workspace-modal";

const WorkspaceSwitcher = () => {
  console.info("rendering");
  const router = useRouter();
  const { workspaceId } = useParams();
  const { isPending, data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();
  if (isPending) return <h2>Loading...</h2>;
  //   console.info("checkin")

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId as string}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-2 py-6">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents.map((workspace: any) => {
            return (
              <SelectItem value={workspace.$id} key={workspace.$id}>
                <div className="flex justify-start items-center gap-3 font-medium">
                  <WorkspaceAvatar
                    name={workspace.name}
                    image={workspace.imageUrl}
                  />
                  <span className="truncate">{workspace.name}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
