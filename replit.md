# Overview

This is a plugin/package manager application for GL.iNet routers, specifically designed for the Beryl AX model. The application provides a web-based interface for browsing, installing, and managing OpenWRT packages and plugins. It features a dashboard for system monitoring, package installation management, and service control with real-time status updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for package management, installations, and system status
- **Development**: Vite integration for hot module replacement in development mode
- **Logging**: Custom request logging middleware with response capture

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Centralized schema definitions in shared directory for both client and server
- **Connection**: Neon Database serverless for cloud PostgreSQL hosting
- **Migrations**: Drizzle Kit for database schema management and migrations
- **Development Storage**: In-memory storage implementation for development/testing

## Database Schema Design
- **packages**: Core package information (name, category, description, version, status)
- **installations**: Installed package tracking with metadata (memory usage, uptime, enabled state)
- **systemStatus**: System resource monitoring (memory, storage, CPU load)
- **services**: System service management and monitoring

## Component Architecture
- **UI Components**: Modular shadcn/ui components with consistent theming
- **Business Logic**: Separation of presentation and business logic through custom hooks
- **Data Flow**: Unidirectional data flow with React Query for server state
- **Error Handling**: Centralized error handling with toast notifications

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: Cookie-based authentication with session persistence
- **CORS**: Configured for cross-origin requests with credentials

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production
- **Drizzle ORM**: Type-safe database operations and query building
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI Framework and Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library for consistent iconography

## Development and Build Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Static type checking for both frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation and schema definition

## Routing and Navigation
- **Wouter**: Lightweight client-side routing for React applications

## Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional CSS class name utility
- **class-variance-authority**: Type-safe variant-based styling system