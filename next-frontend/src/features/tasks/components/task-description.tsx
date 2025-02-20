import React, { useState } from "react";
import { Task } from "../types";
import { Button } from "@/components/ui/button";
import { PencilIcon, XIcon } from "lucide-react";
import DottedSeperator from "@/components/dotted-seperator";
import { useUpdateTask } from "../api/use-update-task";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
interface TaskDescriptionProps {
  task: Task;
}
const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();
  const router = useRouter();
  const handleSave = () => {
    mutate({
      taskId: task.$id,
      description: value,
    }, {
        onSuccess: () => {
            router.refresh();
        }
    });
  };
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button onClick={() => setIsEditing((prev) => !prev)} size={"sm"}>
          {isEditing ? (
            <XIcon className="size-4 mr-2" />
          ) : (
            <PencilIcon className="size-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeperator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            placeholder="Add a description..."
            value={value}
            rows={4}
            onChange={(e) => setValue(e.target.value)}
            disabled={isPending}
          />
          <Button onClick={handleSave} disabled={isPending} size={"sm"} className="w-fit ml-auto">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
