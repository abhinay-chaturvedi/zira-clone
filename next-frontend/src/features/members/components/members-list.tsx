"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import DottedSeperator from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import React, { Fragment } from "react";
import { useGetMembers } from "../api/use-get-members";
import MemberAvatar from "./member-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "../api/use-delete-member";
import { useUpdateMember } from "../api/use-update-member";
import { useConfirm } from "@/hooks/use-confirm";
interface MembersListProps {
  workspaceId: string;
}
const MembersList = ({ workspaceId }: MembersListProps) => {
  const { data } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );
  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) {
      return;
    }

    deleteMember(
      { param: memberId },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };
  const handleUpdateMember = (memberId: string, role: string) => {
    updateMember({ param: memberId, role });
  };
  //   console.log(data)
  return (
    <div>
      <ConfirmDialog />
      {/* <Button onClick={() => handleDeleteMember("lkdjlsj")}>click</Button> */}
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-1">
          <Button asChild variant={"secondary"} size={"sm"}>
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeftIcon className="size-4" />
              Back
            </Link>
          </Button>
          <CardTitle className="text-xl font-bold">Members List</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeperator />
        </div>
        <CardContent className="p-7">
          {data?.documents.map((member: any, index: number) => {
            return (
              <Fragment key={index}>
                <div className="flex items-center gap-2">
                  <MemberAvatar
                    className="size-10"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant={"secondary"}
                        size={"icon"}
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                      <DropdownMenuItem
                        disabled={isUpdatingMember}
                        onClick={() => handleUpdateMember(member.$id, "ADMIN")}
                        className="font-medium"
                      >
                        Set as Administration
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={isUpdatingMember}
                        onClick={() => handleUpdateMember(member.$id, "MEMBER")}
                        className="font-medium"
                      >
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={isDeletingMember}
                        onClick={() => handleDeleteMember(member.$id)}
                        className="font-medium text-amber-700"
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {index < data?.documents.length - 1 && (
                  <DottedSeperator className="py-3 w-full" />
                )}
              </Fragment>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersList;
