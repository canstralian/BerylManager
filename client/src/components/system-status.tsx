import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/progress-bar";
import { MemoryStick, HardDrive, Cpu, ServerCog, Play, Square, RotateCcw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type SystemStatus as SystemStatusType, type Service } from "@shared/schema";

export default function SystemStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: systemStatus, isLoading: statusLoading } = useQuery<SystemStatusType>({
    queryKey: ["/api/system/status"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const controlServiceMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: string }) => {
      return apiRequest("PATCH", `/api/services/${id}/${action}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({
        title: "Service Updated",
        description: "Service status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Operation Failed",
        description: "Failed to update service status.",
        variant: "destructive",
      });
    },
  });

  const getServiceIcon = (iconClass: string) => {
    if (iconClass.includes("fa-shield-alt")) return "🛡️";
    if (iconClass.includes("fa-wifi")) return "📶";
    if (iconClass.includes("fa-chart-bar")) return "📊";
    return "⚙️";
  };

  if (statusLoading || servicesLoading) {
    return (
      <div className="text-center py-8" data-testid="loading-system-status">
        Loading system status...
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="system-status-container">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="system-overview">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                <p className="text-2xl font-bold" data-testid="memory-percentage">
                  {systemStatus?.memoryUsage}%
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <MemoryStick className="text-warning h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar 
                progress={systemStatus?.memoryUsage || 0} 
                variant="warning"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2" data-testid="memory-details">
              {Math.round((systemStatus?.memoryUsage || 0) * (systemStatus?.memoryTotal || 0) / 100)} MB / {systemStatus?.memoryTotal} MB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Storage Usage</p>
                <p className="text-2xl font-bold" data-testid="storage-percentage">
                  {systemStatus?.storageUsage}%
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <HardDrive className="text-success h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar 
                progress={systemStatus?.storageUsage || 0} 
                variant="success"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2" data-testid="storage-details">
              {Math.round((systemStatus?.storageUsage || 0) * (systemStatus?.storageTotal || 0) / 100 / 1000)} GB / {Math.round((systemStatus?.storageTotal || 0) / 1000)} GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CPU Load</p>
                <p className="text-2xl font-bold" data-testid="cpu-load">
                  {systemStatus?.cpuLoad}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Cpu className="text-primary h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar 
                progress={31} 
                variant="primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Average load</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold" data-testid="active-services">
                  {systemStatus?.activeServices}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ServerCog className="text-success h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Running: {services.filter((s) => s.status === "running").length}</span>
                <span>Stopped: {services.filter((s) => s.status === "stopped").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Table */}
      <Card data-testid="services-table">
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Service</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Memory</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Uptime</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-muted/30" data-testid={`service-row-${service.id}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{getServiceIcon(service.iconClass)}</span>
                        <span className="font-medium" data-testid={`service-name-${service.id}`}>
                          {service.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className={`status-dot ${service.status === "running" ? "status-running" : "status-stopped"}`}></span>
                        <span 
                          className={`text-sm font-medium ${service.status === "running" ? "text-success" : "text-destructive"}`}
                          data-testid={`service-status-${service.id}`}
                        >
                          {service.status === "running" ? "Running" : "Stopped"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground" data-testid={`service-memory-${service.id}`}>
                      {service.memoryUsage}
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground" data-testid={`service-uptime-${service.id}`}>
                      {service.uptime}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {service.status === "running" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                              onClick={() => controlServiceMutation.mutate({ id: service.id, action: "stop" })}
                              disabled={controlServiceMutation.isPending}
                              data-testid={`button-stop-${service.id}`}
                            >
                              <Square className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-warning border-warning hover:bg-warning hover:text-white"
                              onClick={() => controlServiceMutation.mutate({ id: service.id, action: "restart" })}
                              disabled={controlServiceMutation.isPending}
                              data-testid={`button-restart-${service.id}`}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Restart
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-success border-success hover:bg-success hover:text-white"
                            onClick={() => controlServiceMutation.mutate({ id: service.id, action: "start" })}
                            disabled={controlServiceMutation.isPending}
                            data-testid={`button-start-${service.id}`}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}