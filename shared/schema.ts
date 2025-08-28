import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  version: text("version").notNull(),
  size: text("size").notNull(),
  status: text("status").notNull().default("available"), // available, installing, installed
  iconClass: text("icon_class").notNull().default("fas fa-puzzle-piece"),
});

export const installations = pgTable("installations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  packageId: varchar("package_id").notNull(),
  isEnabled: boolean("is_enabled").notNull().default(false),
  memoryUsage: text("memory_usage"),
  uptime: text("uptime"),
  installDate: timestamp("install_date").notNull().default(sql`now()`),
});

export const systemStatus = pgTable("system_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memoryUsage: integer("memory_usage").notNull(),
  memoryTotal: integer("memory_total").notNull(),
  storageUsage: integer("storage_usage").notNull(),
  storageTotal: integer("storage_total").notNull(),
  cpuLoad: text("cpu_load").notNull(),
  activeServices: integer("active_services").notNull(),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  status: text("status").notNull(), // running, stopped
  memoryUsage: text("memory_usage"),
  uptime: text("uptime"),
  iconClass: text("icon_class").notNull().default("fas fa-cogs"),
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertInstallationSchema = createInsertSchema(installations).omit({
  id: true,
  installDate: true,
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertInstallation = z.infer<typeof insertInstallationSchema>;
export type Installation = typeof installations.$inferSelect;

export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
