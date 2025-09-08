import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ToggleSwitch from "./toggle-switch";
import type { Package } from "@shared/schema";

interface InstalledPackageItemProps {
  package: Package;
  isEnabled: boolean;
}

export default function InstalledPackageItem({
  package: pkg,
  isEnabled,
}: InstalledPackageItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const uninstallMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const response = await fetch(`/api/installations/${packageId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to uninstall package");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/installations"] });
      toast({
        title: "Package uninstalled",
        description: `${pkg.name} has been uninstalled successfully.`,
      });
    },
    onError: () => {
      toast({
        title: "Uninstallation failed",
        description: "Failed to uninstall the package. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ packageId, enabled }: { packageId: string; enabled: boolean }) => {
      const response = await fetch(`/api/installations/${packageId}/toggle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      if (!response.ok) throw new Error("Failed to toggle package");
      return response.json();
    },
    onSuccess: (_, { enabled }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/installations"] });
      toast({
        title: `Package ${enabled ? "enabled" : "disabled"}`,
        description: `${pkg.name} has been ${enabled ? "enabled" : "disabled"}.`,
      });
    },
    onError: () => {
      toast({
        title: "Toggle failed",
        description: "Failed to toggle the package. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isMobile) {
    return (
      <div className="border rounded-lg p-3 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm truncate">{pkg.name}</span>
              <Badge variant="outline" className="text-xs w-fit">
                {pkg.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{pkg.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ToggleSwitch
              checked={isEnabled}
              onCheckedChange={(enabled) =>
                toggleMutation.mutate({ packageId: pkg.id, enabled })
              }
              disabled={toggleMutation.isPending}
            />
            <span className="text-xs text-muted-foreground">
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => uninstallMutation.mutate(pkg.id)}
            disabled={uninstallMutation.isPending}
            className="text-destructive hover:text-destructive touch-target"
          >
            {uninstallMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        <ToggleSwitch
          checked={isEnabled}
          onCheckedChange={(enabled) =>
            toggleMutation.mutate({ packageId: pkg.id, enabled })
          }
          disabled={toggleMutation.isPending}
        />
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{pkg.name}</span>
            <Badge variant="outline" className="text-xs">
              {pkg.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => uninstallMutation.mutate(pkg.id)}
        disabled={uninstallMutation.isPending}
        className="text-destructive hover:text-destructive"
      >
        {uninstallMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}