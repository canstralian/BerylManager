import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ToggleSwitch from "@/components/toggle-switch";
import { Settings, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InstalledPackageItemProps {
  installation: any;
  onToggle: () => void;
  onUninstall: () => void;
}

export default function InstalledPackageItem({ installation, onToggle, onUninstall }: InstalledPackageItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return apiRequest("PATCH", `/api/installations/${installation.packageId}/toggle`, {
        isEnabled: enabled,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/installations"] });
      onToggle();
    },
    onError: () => {
      toast({
        title: "Toggle Failed",
        description: "Failed to toggle service status.",
        variant: "destructive",
      });
    },
  });

  const uninstallMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/packages/${installation.packageId}/uninstall`);
    },
    onSuccess: () => {
      toast({
        title: "Package Uninstalled",
        description: `${installation.package?.name} has been uninstalled.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installations"] });
      onUninstall();
    },
    onError: () => {
      toast({
        title: "Uninstall Failed",
        description: "Failed to uninstall package.",
        variant: "destructive",
      });
    },
  });

  const getIcon = () => {
    const iconClasses = installation.package?.iconClass || "fas fa-puzzle-piece";
    if (iconClasses.includes("fa-shield-alt")) return "🛡️";
    if (iconClasses.includes("fa-chart-bar")) return "📊";
    return "🧩";
  };

  const handleToggle = (enabled: boolean) => {
    toggleMutation.mutate(enabled);
  };

  return (
    <Card data-testid={`installed-package-${installation.packageId}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground text-lg">{getIcon()}</span>
            </div>
            <div>
              <h3 className="font-semibold" data-testid={`package-name-${installation.packageId}`}>
                {installation.package?.name}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`package-description-${installation.packageId}`}>
                {installation.package?.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                <span data-testid={`package-version-${installation.packageId}`}>
                  Version: {installation.package?.version}
                </span>
                <span data-testid={`package-size-${installation.packageId}`}>
                  Size: {installation.package?.size}
                </span>
                <div className="flex items-center space-x-1">
                  <span className={`status-dot ${installation.isEnabled ? "status-running" : "status-stopped"}`}></span>
                  <span data-testid={`service-status-${installation.packageId}`}>
                    {installation.isEnabled ? "Running" : "Stopped"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ToggleSwitch
              checked={installation.isEnabled}
              onCheckedChange={handleToggle}
              disabled={toggleMutation.isPending}
              data-testid={`toggle-${installation.packageId}`}
            />
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-accent transition-colors"
              data-testid={`button-configure-${installation.packageId}`}
            >
              <Settings className="h-4 w-4 mr-1" />
              Configure
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive hover:bg-destructive hover:text-white transition-colors"
              onClick={() => uninstallMutation.mutate()}
              disabled={uninstallMutation.isPending}
              data-testid={`button-uninstall-${installation.packageId}`}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Uninstall
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
