import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProgressBar from "@/components/progress-bar";
import { Download, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Package } from "@shared/schema";

interface PackageCardProps {
  package: Package;
  onInstallationChange: () => void;
}

export default function PackageCard({ package: pkg, onInstallationChange }: PackageCardProps) {
  const [installProgress, setInstallProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const installMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/packages/${pkg.id}/install`);
    },
    onSuccess: () => {
      toast({
        title: "Installation Started",
        description: `${pkg.name} is being installed...`,
      });

      // Simulate progress
      const interval = setInterval(() => {
        setInstallProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 100) {
            clearInterval(interval);
            queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
            queryClient.invalidateQueries({ queryKey: ["/api/installations"] });
            onInstallationChange();
            toast({
              title: "Installation Complete",
              description: `${pkg.name} has been installed successfully.`,
            });
            return 100;
          }
          return newProgress;
        });
      }, 500);
    },
    onError: () => {
      toast({
        title: "Installation Failed",
        description: `Failed to install ${pkg.name}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = () => {
    switch (pkg.status) {
      case "available":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20" data-testid={`status-${pkg.id}`}>Available</Badge>;
      case "installing":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20" data-testid={`status-${pkg.id}`}>Installing</Badge>;
      case "installed":
        return <Badge variant="outline" className="bg-muted text-muted-foreground" data-testid={`status-${pkg.id}`}>Installed</Badge>;
      default:
        return <Badge variant="outline" data-testid={`status-${pkg.id}`}>Unknown</Badge>;
    }
  };

  const getIcon = () => {
    const iconClasses = pkg.iconClass || "fas fa-puzzle-piece";
    if (iconClasses.includes("fa-shield-alt")) return "🛡️";
    if (iconClasses.includes("fa-wifi")) return "📶";
    if (iconClasses.includes("fa-chart-bar")) return "📊";
    if (iconClasses.includes("fa-globe")) return "🌐";
    if (iconClasses.includes("fa-server")) return "🖥️";
    if (iconClasses.includes("fa-lock")) return "🔒";
    return "🧩";
  };

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`package-card-${pkg.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground text-lg">{getIcon()}</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm" data-testid={`package-name-${pkg.id}`}>{pkg.name}</h3>
              <p className="text-xs text-muted-foreground" data-testid={`package-category-${pkg.id}`}>{pkg.category}</p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <p className="text-sm text-muted-foreground mb-4" data-testid={`package-description-${pkg.id}`}>
          {pkg.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span data-testid={`package-size-${pkg.id}`}>Size: {pkg.size}</span>
          <span data-testid={`package-version-${pkg.id}`}>Version: {pkg.version}</span>
        </div>

        {pkg.status === "installing" && installProgress > 0 ? (
          <div className="space-y-2">
            <ProgressBar progress={installProgress} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Installing...</span>
              <span data-testid={`install-progress-${pkg.id}`}>{Math.round(installProgress)}%</span>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => installMutation.mutate()}
            disabled={pkg.status === "installed" || installMutation.isPending}
            className={`w-full ${
              pkg.status === "installed"
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            data-testid={`button-install-${pkg.id}`}
          >
            {pkg.status === "installed" ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Installed
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Install
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}