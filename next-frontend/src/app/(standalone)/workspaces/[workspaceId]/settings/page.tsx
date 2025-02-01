import EditWorkspaceForm from "@/features/workspaces/components/edit-workspace-form";
import { getCurrent, getWorkspace } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
interface SettingsPageProps {
  params: {
    workspaceId: string;
  };
}
const Page = async ({ params }: SettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const initialValue = await getWorkspace({ workspaceId: params.workspaceId });
  if (!initialValue) redirect("/");
  return (
    <div className="w-full lg:max-w-2xl">
      <EditWorkspaceForm initialValue={initialValue} />
    </div>
  );
};

export default Page;
