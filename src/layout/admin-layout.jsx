import { Outlet, useLocation, Link } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function AdminLayout() {

  const location = useLocation();

  /**
   * =====================================
   * DYNAMIC BREADCRUMB
   * =====================================
   */

  const pathnames = location.pathname
      .split("/")
      .filter(Boolean);

  const formatLabel = (value) => {
    return value
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
      <div>

        <SidebarProvider>

          <AppSidebar />

          <SidebarInset className="bg-[#f3f4f6] min-h-screen">

            {/* =====================================
              HEADER
          ===================================== */}

            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">

              <SidebarTrigger className="-ml-1" />

              <Separator
                  orientation="vertical"
                  className="mr-2 h-4"
              />

              <Breadcrumb>

                <BreadcrumbList>

                  {pathnames.map((name, index) => {

                    const breadcrumbOverride =
                        location.state?.breadcrumb;

                    const routeTo = `/${pathnames
                        .slice(0, index + 1)
                        .join("/")}`;

                    const isLast =
                        index === pathnames.length - 1;

                    return (
                        <div
                            key={routeTo}
                            className="flex items-center"
                        >

                          <BreadcrumbItem>

                            {isLast ? (
                                // <BreadcrumbPage>
                                //   {formatLabel(name)}
                                // </BreadcrumbPage>
                                <BreadcrumbPage>
                                  {isLast &&
                                  breadcrumbOverride
                                      ? breadcrumbOverride
                                      : formatLabel(name)}
                                </BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                  <Link to={routeTo}>
                                    {formatLabel(name)}
                                  </Link>
                                </BreadcrumbLink>
                            )}

                          </BreadcrumbItem>

                          {!isLast && (
                              <BreadcrumbSeparator />
                          )}

                        </div>
                    );
                  })}

                </BreadcrumbList>

              </Breadcrumb>

            </header>

            {/* =====================================
              PAGE CONTENT
          ===================================== */}

            <div className="p-4">
              <Outlet />
            </div>

          </SidebarInset>

        </SidebarProvider>

      </div>
  );
}

export default AdminLayout;
