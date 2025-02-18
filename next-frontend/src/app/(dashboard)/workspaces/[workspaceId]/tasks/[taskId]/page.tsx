import { getCurrent } from "@/lib/actions";
import { redirect } from "next/navigation";
import React from "react";
import TaskIdClient from "./client";

const TaskPage = async () => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  return <TaskIdClient />;
};

export default TaskPage;
