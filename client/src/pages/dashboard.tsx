import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import PackageCard from "@/components/package-card";
import InstalledPackageItem from "@/components/installed-package-item";
import SystemStatus from "@/components/system-status";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Upload } from "lucide-react";
import { type Package } from "@shared/schema";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: packages = [], isLoading: packagesLoading, refetch: refetchPackages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const { data: installations = [], isLoading: installationsLoading, refetch: refetchInstallations } = useQuery<any[]>({
    queryKey: ["/api/installations"],
  });

  const filteredPackages = packages.filter((pkg: Package) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || pkg.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const installedCount = installations.length;

  const handleRefresh = () => {
    refetchPackages();
    refetchInstallations();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background" data-testid="dashboard-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4" data-testid="header-section">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold" data-testid="page-title">Plugin Management</h2>
              <p className="text-sm text-muted-foreground" data-testid="page-description">
                Install and manage OpenWrt packages
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                data-testid="button-refresh"
                className="hover:bg-accent/80"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-upload"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Package
              </Button>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-card border-b border-border px-6" data-testid="tab-navigation">
          <nav className="flex space-x-8">
            <button
              className={`tab-button py-3 px-1 text-sm font-medium ${
                activeTab === "browse" ? "active" : ""
              }`}
              onClick={() => setActiveTab("browse")}
              data-testid="tab-browse"
            >
              Browse Packages
            </button>
            <button
              className={`tab-button py-3 px-1 text-sm font-medium ${
                activeTab === "installed" ? "active" : ""
              }`}
              onClick={() => setActiveTab("installed")}
              data-testid="tab-installed"
            >
              Installed{" "}
              <Badge variant="secondary" className="ml-1" data-testid="badge-installed-count">
                {installedCount}
              </Badge>
            </button>
            <button
              className={`tab-button py-3 px-1 text-sm font-medium ${
                activeTab === "system" ? "active" : ""
              }`}
              onClick={() => setActiveTab("system")}
              data-testid="tab-system"
            >
              System Status
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto" data-testid="content-area">
          {activeTab === "browse" && (
            <div className="p-6" data-testid="browse-tab-content">
              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search packages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        data-testid="input-search"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-40" data-testid="select-category">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="network">Network</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="name">
                      <SelectTrigger className="w-40" data-testid="select-sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Sort by Name</SelectItem>
                        <SelectItem value="size">Sort by Size</SelectItem>
                        <SelectItem value="date">Sort by Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Package Grid */}
              {packagesLoading ? (
                <div className="text-center py-8" data-testid="loading-packages">
                  Loading packages...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="package-grid">
                  {filteredPackages.map((pkg: Package) => (
                    <PackageCard 
                      key={pkg.id} 
                      package={pkg} 
                      onInstallationChange={refetchPackages}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "installed" && (
            <div className="p-6" data-testid="installed-tab-content">
              {installationsLoading ? (
                <div className="text-center py-8" data-testid="loading-installations">
                  Loading installed packages...
                </div>
              ) : (
                <div className="space-y-4" data-testid="installed-packages-list">
                  {installations.map((installation) => (
                    <InstalledPackageItem
                      key={installation.id}
                      installation={installation}
                      onToggle={refetchInstallations}
                      onUninstall={() => {
                        refetchInstallations();
                        refetchPackages();
                      }}
                    />
                  ))}
                  {installations.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground" data-testid="no-installations">
                      No packages installed yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "system" && (
            <div className="p-6" data-testid="system-tab-content">
              <SystemStatus />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
