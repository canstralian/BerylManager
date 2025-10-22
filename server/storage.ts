import { type Package, type InsertPackage, type Installation, type InsertInstallation, type SystemStatus, type InsertSystemStatus, type Service, type InsertService } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Packages
  getPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, updates: Partial<Package>): Promise<Package | undefined>;
  
  // Installations
  getInstallations(): Promise<Installation[]>;
  getInstallation(packageId: string): Promise<Installation | undefined>;
  createInstallation(installation: InsertInstallation): Promise<Installation>;
  updateInstallation(packageId: string, updates: Partial<Installation>): Promise<Installation | undefined>;
  deleteInstallation(packageId: string): Promise<boolean>;
  
  // System Status
  getSystemStatus(): Promise<SystemStatus | undefined>;
  updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus>;
  
  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  updateService(id: string, updates: Partial<Service>): Promise<Service | undefined>;
}

export class MemStorage implements IStorage {
  private packages: Map<string, Package>;
  private installations: Map<string, Installation>;
  private systemStatus: SystemStatus | undefined;
  private services: Map<string, Service>;

  constructor() {
    this.packages = new Map();
    this.installations = new Map();
    this.services = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed packages
    const samplePackages: Package[] = [
      {
        id: "1",
        name: "luci-app-adblock",
        category: "Security",
        description: "Web interface for AdBlock service to block advertisements",
        version: "1.8.19",
        size: "2.1 MB",
        status: "available",
        iconClass: "fas fa-shield-alt"
      },
      {
        id: "2",
        name: "hostapd-utils",
        category: "Network",
        description: "IEEE 802.11 AP utilities for wireless network management",
        version: "2022.11.16",
        size: "156 KB",
        status: "installing",
        iconClass: "fas fa-wifi"
      },
      {
        id: "3",
        name: "collectd",
        category: "System",
        description: "System statistics collection daemon for monitoring",
        version: "5.12.0",
        size: "89 KB",
        status: "installed",
        iconClass: "fas fa-chart-bar"
      },
      {
        id: "4",
        name: "ddns-scripts",
        category: "Network",
        description: "Dynamic DNS client scripts for various providers",
        version: "2.8.2",
        size: "45 KB",
        status: "available",
        iconClass: "fas fa-globe"
      },
      {
        id: "5",
        name: "nginx",
        category: "Network",
        description: "High-performance HTTP server and reverse proxy",
        version: "1.20.2",
        size: "512 KB",
        status: "available",
        iconClass: "fas fa-server"
      },
      {
        id: "6",
        name: "luci-app-openvpn",
        category: "Security",
        description: "LuCI web interface for OpenVPN configuration",
        version: "git-22.073",
        size: "15 KB",
        status: "available",
        iconClass: "fas fa-lock"
      }
    ];

    samplePackages.forEach(pkg => this.packages.set(pkg.id, pkg));

    // Seed installations
    const installations: Installation[] = [
      {
        id: "1",
        packageId: "1",
        isEnabled: true,
        memoryUsage: "12.4 MB",
        uptime: "2d 14h 23m",
        installDate: new Date()
      },
      {
        id: "2",
        packageId: "3",
        isEnabled: false,
        memoryUsage: "0 MB",
        uptime: "-",
        installDate: new Date()
      }
    ];

    installations.forEach(inst => this.installations.set(inst.packageId, inst));

    // Seed system status
    this.systemStatus = {
      id: "1",
      memoryUsage: 68,
      memoryTotal: 402,
      storageUsage: 42,
      storageTotal: 12400,
      cpuLoad: "1.24",
      activeServices: 8,
      updatedAt: new Date()
    };

    // Seed services
    const sampleServices: Service[] = [
      {
        id: "1",
        name: "AdBlock",
        status: "running",
        memoryUsage: "12.4 MB",
        uptime: "2d 14h 23m",
        iconClass: "fas fa-shield-alt"
      },
      {
        id: "2",
        name: "hostapd",
        status: "running",
        memoryUsage: "8.2 MB",
        uptime: "5d 2h 15m",
        iconClass: "fas fa-wifi"
      },
      {
        id: "3",
        name: "collectd",
        status: "stopped",
        memoryUsage: "0 MB",
        uptime: "-",
        iconClass: "fas fa-chart-bar"
      }
    ];

    sampleServices.forEach(service => this.services.set(service.id, service));
  }

  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const newPackage: Package = { 
      ...insertPackage, 
      id,
      status: insertPackage.status || "available",
      iconClass: insertPackage.iconClass || "fas fa-puzzle-piece"
    };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  async updatePackage(id: string, updates: Partial<Package>): Promise<Package | undefined> {
    const existing = this.packages.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.packages.set(id, updated);
    return updated;
  }

  async getInstallations(): Promise<Installation[]> {
    return Array.from(this.installations.values());
  }

  async getInstallation(packageId: string): Promise<Installation | undefined> {
    return this.installations.get(packageId);
  }

  async createInstallation(insertInstallation: InsertInstallation): Promise<Installation> {
    const id = randomUUID();
    const installation: Installation = { 
      ...insertInstallation, 
      id,
      isEnabled: insertInstallation.isEnabled ?? false,
      memoryUsage: insertInstallation.memoryUsage ?? null,
      uptime: insertInstallation.uptime ?? null,
      installDate: new Date()
    };
    this.installations.set(installation.packageId, installation);
    return installation;
  }

  async updateInstallation(packageId: string, updates: Partial<Installation>): Promise<Installation | undefined> {
    const existing = this.installations.get(packageId);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.installations.set(packageId, updated);
    return updated;
  }

  async deleteInstallation(packageId: string): Promise<boolean> {
    return this.installations.delete(packageId);
  }

  async getSystemStatus(): Promise<SystemStatus | undefined> {
    return this.systemStatus;
  }

  async updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus> {
    this.systemStatus = {
      id: this.systemStatus?.id || randomUUID(),
      ...status,
      updatedAt: new Date()
    };
    return this.systemStatus;
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service | undefined> {
    const existing = this.services.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.services.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
