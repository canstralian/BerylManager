import { Router, Gauge, Settings, Download } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigationItems = [
    { id: "browse", icon: Router, label: "Plugins", active: activeTab === "browse" || activeTab === "installed" },
    { id: "system", icon: Gauge, label: "System Status", active: activeTab === "system" },
    { id: "settings", icon: Settings, label: "Settings", active: false },
    { id: "backup", icon: Download, label: "Backup", active: false },
  ];

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col" data-testid="sidebar">
      {/* Header */}
      <div className="p-4 border-b border-border" data-testid="sidebar-header">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Router className="text-primary-foreground h-4 w-4" />
          </div>
          <div>
            <h1 className="font-semibold text-sm" data-testid="router-name">GL.iNet Beryl AX</h1>
            <p className="text-xs text-muted-foreground" data-testid="app-name">Plugin Manager</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4" data-testid="sidebar-navigation">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (item.id === "browse") {
                    onTabChange("browse");
                  } else if (item.id === "system") {
                    onTabChange("system");
                  }
                }}
                className={`sidebar-nav-item w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-left ${
                  item.active ? "active" : ""
                }`}
                data-testid={`nav-${item.id}`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border" data-testid="sidebar-footer">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span className="status-dot status-running"></span>
          <span data-testid="router-status">Router Online</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1" data-testid="firmware-version">
          Firmware: OpenWrt 22.03.3
        </div>
      </div>
    </div>
  );
}
