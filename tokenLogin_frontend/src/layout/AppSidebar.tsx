"use client";

import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useSidebar } from "../context/SidebarContext";
import { PageIcon } from "../icons/index";
import { userStateStore } from '@/lib/userStateStore';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
};

const visitMenu: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "home",
    path: "/"
  },
  {
    icon: <PageIcon />,
    name: "Sign Up",
    path: "/signup"
  },
  {
    icon: <PageIcon />,
    name: "Sign In",
    path: "/signin"
  }
];

const userMenu: NavItem[] = [
  {
    icon: <PageIcon />,
    name: "home",
    path: "/"
  },
  {
    icon: <PageIcon />,
    name: "Profile",
    path: "/profile"
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const isActive = useCallback((path: string) => path === pathname, [pathname]);
  const userStateCheck = userStateStore((state) => state.check);
  
  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-1">
      {navItems.map((nav) => (
        <li key={nav.name}>
          {(
            nav.path && (
              <Link href={nav.path}
                className={cn("group menu-item", isActive(nav.path) ? "menu-item-active" : "menu-item-inactive")} >
                <span className={cn(isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive")}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (<span className="menu-item-text">
                  {nav.name}
                </span>)}
              </Link>)
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out xl:mt-0 rtl:right-0 rtl:left-auto rtl:border-r-0 rtl:border-l dark:border-gray-800 dark:bg-gray-900
        ${isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"} xl:translate-x-0 xl:rtl:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} >
      <div className={`flex py-8 ${!isExpanded && !isHovered ? "xl:justify-center" : "justify-start"}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo" width={150} height={40}
                priority
                style={{ width: "auto", height: "auto" }} />
              <Image className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo" width={150} height={40}
                priority
                style={{ width: "auto", height: "auto" }} />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg"
              alt="Logo" width={32} height={32}
              priority
              style={{ width: "auto", height: "auto" }} />
          )
          }
        </Link>
      </div>
      {renderMenuItems(userStateCheck ? userMenu : visitMenu)}
    </aside>
  );
};

export default AppSidebar;