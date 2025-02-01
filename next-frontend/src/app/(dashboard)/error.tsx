"use client"
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <AlertTriangle className="size-6" />
      <p className="text-sm">Something went wrong</p>
      <Button variant={"secondary"}>
        <Link href={"/"}>Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
