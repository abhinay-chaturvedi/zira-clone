import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";
import { getCurrent, getWorkspace } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
interface WorkspaceJoinPageProps {
  params: {
    inviteCode: string;
    workspaceId: string;
  };
}

const Page = async ({ params }: WorkspaceJoinPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const workspace = await getWorkspace({ workspaceId: params.workspaceId });
  if (!workspace) redirect("/");
  return (
    <div className="w-full lg: max-w-xl">
      <JoinWorkspaceForm
        name={workspace.name}
        workspaceId={params.workspaceId}
        code={params.inviteCode}
      />
    </div>
  );
};

export default Page;
