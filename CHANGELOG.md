# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive repository analysis document (REPOSITORY_ANALYSIS.md)
- .env.example file with all required environment variables
- This CHANGELOG.md file for tracking changes

### Fixed
- TypeScript compilation error: reserved word 'package' in server/storage.ts
- TypeScript compilation error: missing required prop in PackageCard component
- Package metadata: updated name from 'rest-express' to 'beryl-manager'
- Package license: aligned to Apache-2.0 across all files

### Changed
- Made onInstallationChange prop optional in PackageCard component

## [0.1.0] - 2024-10-22

### Added
- Initial release of BerylManager
- React-based frontend with TypeScript
- Express backend API
- Package management interface
- Service monitoring dashboard
- System status monitoring
- In-memory storage implementation
