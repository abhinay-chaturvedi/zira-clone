"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathName = usePathname();
  const isSignIn = pathName == "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      {/* <Image src={"/logo.svg"} height={50} width={100} alt="LOGO"/> */}
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src={"/logo.svg"} alt="logo" width={92} height={46} />
          <div className="flex items-center gap-2"></div>
          <Link href={isSignIn ? "/sign-up" : "sign-in"}>
            <Button variant={"outline"}>
              {isSignIn ? "Sign up" : "Login"}
            </Button>
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
