import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInstallationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch packages" });
    }
  });

  // Install a package
  app.post("/api/packages/:id/install", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Update package status to installing
      await storage.updatePackage(id, { status: "installing" });
      
      // Simulate installation delay
      setTimeout(async () => {
        await storage.updatePackage(id, { status: "installed" });
        await storage.createInstallation({
          packageId: id,
          isEnabled: false,
          memoryUsage: "0 MB",
          uptime: "-"
        });
      }, 3000);
      
      res.json({ success: true, message: "Installation started" });
    } catch (error) {
      res.status(500).json({ error: "Failed to install package" });
    }
  });

  // Uninstall a package
  app.delete("/api/packages/:id/uninstall", async (req, res) => {
    try {
      const { id } = req.params;
      
      await storage.updatePackage(id, { status: "available" });
      await storage.deleteInstallation(id);
      
      res.json({ success: true, message: "Package uninstalled" });
    } catch (error) {
      res.status(500).json({ error: "Failed to uninstall package" });
    }
  });

  // Get installed packages
  app.get("/api/installations", async (req, res) => {
    try {
      const installations = await storage.getInstallations();
      const packages = await storage.getPackages();
      
      const installedPackages = installations.map(installation => {
        const pkg = packages.find(p => p.id === installation.packageId);
        return {
          ...installation,
          package: pkg
        };
      });
      
      res.json(installedPackages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch installations" });
    }
  });

  // Toggle package service
  app.patch("/api/installations/:packageId/toggle", async (req, res) => {
    try {
      const { packageId } = req.params;
      const { isEnabled } = req.body;
      
      const updated = await storage.updateInstallation(packageId, { 
        isEnabled,
        memoryUsage: isEnabled ? "12.4 MB" : "0 MB",
        uptime: isEnabled ? "0h 0m" : "-"
      });
      
      if (!updated) {
        return res.status(404).json({ error: "Installation not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle service" });
    }
  });

  // Get system status
  app.get("/api/system/status", async (req, res) => {
    try {
      const status = await storage.getSystemStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system status" });
    }
  });

  // Get services
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  // Control service (start/stop/restart)
  app.patch("/api/services/:id/:action", async (req, res) => {
    try {
      const { id, action } = req.params;
      
      let status = "running";
      let memoryUsage = "8.2 MB";
      let uptime = "0h 0m";
      
      if (action === "stop") {
        status = "stopped";
        memoryUsage = "0 MB";
        uptime = "-";
      } else if (action === "restart") {
        status = "running";
        uptime = "0h 0m";
      }
      
      const updated = await storage.updateService(id, {
        status,
        memoryUsage,
        uptime
      });
      
      if (!updated) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to control service" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
