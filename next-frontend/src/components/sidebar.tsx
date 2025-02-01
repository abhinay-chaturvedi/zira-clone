import Image from "next/image";
import Link from "next/link";
import React from "react";
import DottedSeperator from "./dotted-seperator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import Projects from "./projects";

const SideBar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"} className="flex justify-center">
        <Image src={"./logo.svg"} alt="logo" width={104} height={20} />
      </Link>
      <DottedSeperator className="my-4"/>
      <WorkspaceSwitcher/>
      <DottedSeperator className="my-4"/>
      <Navigation/>
      <DottedSeperator className="my-4"/>
      <Projects/>
    </aside>
  );
};

export default SideBar;
