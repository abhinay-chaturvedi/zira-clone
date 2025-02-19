import { Button } from "@/components/ui/button";
import ProjectAvatar from "@/features/projects/components/project-avatar";
import { getCurrent, getProject } from "@/lib/actions";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import TaskViewSwitcher from "../../../../../../features/tasks/components/task-view-switcher";
import ProjectAnalytics from "@/features/projects/components/project-analytics";

interface ProjectIdPageProps {
  params: {
    projectId: string;
  };
}
const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  const initialValues = await getProject({ projectId: params.projectId });
  if (!initialValues) {
    throw new Error("Project Not Found");
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={initialValues.name}
            image={initialValues.imageUrl}
            className="size-8"
          />
          <p className="text-lg font-semibold">{initialValues.name}</p>
        </div>
        <div>
          <Button variant={"secondary"} asChild>
            <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}>
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <ProjectAnalytics/>
      <TaskViewSwitcher hideProjectFilter/>
    </div>
  );
};

export default ProjectIdPage;
