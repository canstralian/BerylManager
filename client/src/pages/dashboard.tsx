import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import PackageCard from "@/components/package-card";
import InstalledPackageItem from "@/components/installed-package-item";
import SystemStatus from "@/components/system-status";
import type { Package, Installation } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("packages");
  const isMobile = useIsMobile();

  const {
    data: packages,
    isLoading: packagesLoading,
    error: packagesError,
  } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const {
    data: installations,
    isLoading: installationsLoading,
    error: installationsError,
  } = useQuery<Installation[]>({
    queryKey: ["/api/installations"],
  });

  if (packagesError || installationsError) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Failed to load data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const installedPackages = packages?.filter((pkg) =>
    installations?.some((inst) => inst.packageId === pkg.id)
  );

  const availablePackages = packages?.filter(
    (pkg) => !installations?.some((inst) => inst.packageId === pkg.id)
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 px-3 sm:px-4 border-b">
            <SidebarTrigger className="-ml-1 touch-target" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-base sm:text-lg font-semibold truncate">
              {isMobile ? "Package Manager" : "OpenWrt Package Manager"}
            </h1>
          </header>

          <div className="flex-1 space-y-3 sm:space-y-4 p-3 sm:p-4 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <SystemStatus />

            <div className="space-y-3 sm:space-y-4">
              {/* Mobile-optimized tab navigation */}
              <div className="flex space-x-1 rounded-lg bg-muted p-1">
                <Button
                  variant={activeTab === "packages" ? "default" : "ghost"}
                  className="flex-1 tab-button btn-mobile text-xs sm:text-sm"
                  onClick={() => setActiveTab("packages")}
                >
                  {isMobile ? "Available" : "Available Packages"}
                </Button>
                <Button
                  variant={activeTab === "installed" ? "default" : "ghost"}
                  className="flex-1 tab-button btn-mobile text-xs sm:text-sm"
                  onClick={() => setActiveTab("installed")}
                >
                  Installed
                  {installedPackages && (
                    <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                      {installedPackages.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {activeTab === "packages" && (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {packagesLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="animate-pulse mobile-card">
                        <CardHeader className="pb-2 sm:pb-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <div className="h-3 bg-muted rounded"></div>
                            <div className="h-3 bg-muted rounded w-2/3"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    availablePackages?.map((pkg) => (
                      <PackageCard key={pkg.id} package={pkg} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "installed" && (
                <Card className="mobile-card">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-lg sm:text-xl">Installed Packages</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 sm:space-y-3">
                      {installationsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 border rounded-lg animate-pulse touch-target"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-4 bg-muted rounded w-24 sm:w-32"></div>
                            </div>
                            <div className="h-8 bg-muted rounded w-12 sm:w-16"></div>
                          </div>
                        ))
                      ) : installedPackages?.length === 0 ? (
                        <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">
                          No packages installed yet.
                        </p>
                      ) : (
                        installedPackages?.map((pkg) => {
                          const installation = installations?.find(
                            (inst) => inst.packageId === pkg.id
                          );
                          return (
                            <InstalledPackageItem
                              key={pkg.id}
                              package={pkg}
                              isEnabled={installation?.isEnabled ?? false}
                            />
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}