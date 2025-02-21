"use client";
import { UserButton } from "@/features/auth/components/user-button";
import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { usePathname } from "next/navigation";
const pathnameMap = {
  tasks: {
    title: "My tasks",
    description: "View all your task.",
  },
  projects: {
    title: "My Project",
    description: "View tasks of your proejct here.",
  },
};
const Navbar = () => {
  const pathname = usePathname();
  const key = pathname.split("/")[3] as keyof typeof pathnameMap;
  const defaultMap = {
    title: "Home",
    description: "Monitor all of your projects and tasks here"
  }
  const { title, description } = pathnameMap[key] || defaultMap;
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};

export default Navbar;
