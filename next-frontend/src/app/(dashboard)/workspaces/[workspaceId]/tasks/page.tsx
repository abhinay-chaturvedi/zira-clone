import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { getCurrent } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";

const TasksPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div>
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
