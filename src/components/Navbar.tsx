import Link from "next/link";
import React from "react";
import DesktopNav from "./DesktopNav";
import ModeToggle from "./ModeToggle";
export default async function Navbar() {
 
  return (
    <nav className="top-0 sticky z-50 w-full  border-b bg-background/95 backdrop-blur support-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className=" flex justify-between items-center h-16">
          <div className="flex items-center">
          <ModeToggle  />
            <Link
              href={"/"}
              className="font-bold text-xl ml-10 text-primary font-mono tracking-wider"
            >
              Socially
            </Link>
          </div>
          <DesktopNav />
          {/* <MobileNavbar /> */}
        </div>
      </div>
    </nav>
  );
}
