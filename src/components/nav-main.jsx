"use client";

import { Link, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { ChevronRightIcon } from "lucide-react";

export function NavMain({
                          items,
                        }) {

  const location = useLocation();

  /**
   * =====================================
   * CHECK ACTIVE
   * =====================================
   */

  const isMenuActive = (item) => {

    if (item.url === location.pathname) {
      return true;
    }

    if (item.items?.length) {
      return item.items.some(
          (sub) => sub.url === location.pathname
      );
    }

    return false;
  };

  return (
      <SidebarGroup>

        <SidebarGroupLabel>
          Platform
        </SidebarGroupLabel>

        <SidebarMenu>

          {items.map((item) => {

            const active = isMenuActive(item);

            /**
             * =====================================
             * HAS CHILDREN
             * =====================================
             */

            const hasChildren =
                item.items &&
                item.items.length > 0;

            /**
             * =====================================
             * DROPDOWN MENU
             * =====================================
             */

            if (hasChildren) {

              return (
                  <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={active}
                      className="group/collapsible"
                  >

                    <SidebarMenuItem>

                      <CollapsibleTrigger asChild>

                        <SidebarMenuButton
                            tooltip={item.title}
                            className={`
                        transition-all
                        hover:bg-primary/10
                        hover:text-primary
                        ${
                                active
                                    ? "bg-primary text-primary-foreground hover:bg-primary"
                                    : ""
                            }
                      `}
                        >

                          {item.icon}

                          <span>{item.title}</span>

                          <ChevronRightIcon
                              className="
                          ml-auto
                          transition-transform
                          duration-200
                          group-data-[state=open]/collapsible:rotate-90
                        "
                          />

                        </SidebarMenuButton>

                      </CollapsibleTrigger>

                      <CollapsibleContent>

                        <SidebarMenuSub>

                          {item.items?.map((subItem) => {

                            const subActive =
                                location.pathname ===
                                subItem.url;

                            return (
                                <SidebarMenuSubItem
                                    key={subItem.title}
                                >

                                  <SidebarMenuSubButton
                                      asChild
                                      className={`
                                transition-all
                                hover:bg-primary/10
                                hover:text-primary
                                ${
                                          subActive
                                              ? "bg-primary/15 text-primary font-medium"
                                              : ""
                                      }
                              `}
                                  >

                                    <Link to={subItem.url}>

                                      {subItem.icon}

                                      <span>
                                  {subItem.title}
                                </span>

                                    </Link>

                                  </SidebarMenuSubButton>

                                </SidebarMenuSubItem>
                            );
                          })}

                        </SidebarMenuSub>

                      </CollapsibleContent>

                    </SidebarMenuItem>

                  </Collapsible>
              );
            }

            /**
             * =====================================
             * NORMAL MENU
             * =====================================
             */

            return (
                <SidebarMenuItem key={item.title}>

                  <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`
                  transition-all
                  hover:bg-primary/10
                  hover:text-primary
                  ${
                          active
                              ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                              : ""
                      }
                `}
                  >

                    <Link to={item.url}>

                      {item.icon}

                      <span>{item.title}</span>

                    </Link>

                  </SidebarMenuButton>

                </SidebarMenuItem>
            );
          })}

        </SidebarMenu>

      </SidebarGroup>
  );
}
