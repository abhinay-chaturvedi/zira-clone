import EditProjectForm from "@/features/projects/components/edit-project-form";
import { getCurrent, getProject } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";

interface ProjectSettingPageProps {
  params: {
    projectId: string;
  };
}
const ProjectSettingPage = async ({ params }: ProjectSettingPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const initialValue = await getProject({ projectId: params.projectId });
  if (!initialValue) throw new Error("Project detail did not find.");
  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValue={initialValue} />
    </div>
  );
};

export default ProjectSettingPage;
