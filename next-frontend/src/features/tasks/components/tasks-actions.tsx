import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useParams, useRouter } from "next/navigation";
import useEditTaskModal from "@/features/hooks/use-edit-task-modal";

interface TasksActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}
export const TaskActions = ({ id, projectId, children }: TasksActionsProps) => {
  const { mutate, isPending: isDeletingTask } = useDeleteTask();
  const router = useRouter();
  const {workspaceId} = useParams<{workspaceId: string}>()

  const { open } = useEditTaskModal()

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "This Action cannot be undone.",
    "destructive"
  );
  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ taskId: id });
  };

  const onOpenTask = () => {
    router.push(`/workspaces/${workspaceId}/tasks/${id}`)
  }
  const onOpenProject = () => {
    router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
  }
  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            disabled={false}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDelete}
            disabled={isDeletingTask}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
