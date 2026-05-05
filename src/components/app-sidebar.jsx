"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Building2,
  Search,
  LineChart,
  Settings,
  Database,
  Users,
} from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    // {
    //   name: "Acme Inc",
    //   logo: (
    //     <GalleryVerticalEndIcon />
    //   ),
    //   plan: "Enterprise",
    // },
    // {
    //   name: "Acme Corp.",
    //   logo: (
    //     <AudioLinesIcon />
    //   ),
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: (
    //     <TerminalIcon />
    //   ),
    //   plan: "Free",
    // },
  ],

  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard />,
    },

    {
      title: "Administration",
      url: "#",
      icon: <Settings />,
      isActive: false,

      items: [
        {
          title: "Import & Sync",
          url: "#",
          icon: <Database />,
        },

        {
          title: "User",
          url: "#",
          icon: <Users />,
        },
      ],
    },

    {
      title: "Properties",
      url: "/admin/property",
      icon: <Building2 />,
    },

    {
      title: "Search",
      url: "/admin/search",
      icon: <Search />,
    },

    {
      title: "Market Insight",
      url: "/admin/market-insight",
      icon: <LineChart />,
    },
  ],

  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: (
  //       <FrameIcon />
  //     ),
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: (
  //       <PieChartIcon />
  //     ),
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: (
  //       <MapIcon />
  //     ),
  //   },
  // ],
};

export function AppSidebar({
                             ...props
                           }) {
  return (
      <Sidebar collapsible="icon" {...props}>

        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} />
          {/*<NavProjects projects={data.projects} />*/}
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>

        <SidebarRail />

      </Sidebar>
  );
}
