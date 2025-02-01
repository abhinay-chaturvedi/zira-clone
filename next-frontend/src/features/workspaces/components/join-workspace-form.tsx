"use client";
import DottedSeperator from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { useJoinWorkspace } from "../api/use-join-workspace.ts";
import { useRouter } from "next/navigation";
interface JoinWorkspaceFormProps {
  name: string;
  workspaceId: string;
  code: string;
}
const JoinWorkspaceForm = ({
  name,
  workspaceId,
  code,
}: JoinWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate, isPending } = useJoinWorkspace();
  const onSubmit = () => {
    mutate(
      { param: workspaceId, code: code },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{name}</strong> workspace.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeperator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
          <Button
            disabled={isPending}
            variant={"secondary"}
            type="button"
            asChild
            className="w-full lg:w-fit"
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            disabled={isPending}
            onClick={onSubmit}
            type="button"
            className="w-full lg:w-fit"
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceForm;
