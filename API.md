# API Documentation

This document describes the REST API endpoints available in BerylManager.

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### Packages

#### Get All Packages

Retrieves a list of all available packages.

**Endpoint:** `GET /api/packages`

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "category": "string",
    "description": "string",
    "version": "string",
    "size": "string",
    "status": "available|installing|installed",
    "iconClass": "string"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved packages
- `500 Internal Server Error` - Failed to fetch packages

---

#### Install Package

Initiates the installation of a package.

**Endpoint:** `POST /api/packages/:id/install`

**Parameters:**
- `id` (path) - Package ID

**Response:**
```json
{
  "success": true,
  "message": "Installation started"
}
```

**Status Codes:**
- `200 OK` - Installation started successfully
- `500 Internal Server Error` - Failed to install package

**Notes:**
- Installation is simulated with a 3-second delay
- Package status changes to "installing" then "installed"

---

#### Uninstall Package

Removes an installed package.

**Endpoint:** `DELETE /api/packages/:id/uninstall`

**Parameters:**
- `id` (path) - Package ID

**Response:**
```json
{
  "success": true,
  "message": "Package uninstalled"
}
```

**Status Codes:**
- `200 OK` - Package uninstalled successfully
- `500 Internal Server Error` - Failed to uninstall package

---

### Installations

#### Get Installed Packages

Retrieves a list of all installed packages with their details.

**Endpoint:** `GET /api/installations`

**Response:**
```json
[
  {
    "id": "string",
    "packageId": "string",
    "isEnabled": boolean,
    "memoryUsage": "string",
    "uptime": "string",
    "installDate": "ISO 8601 timestamp",
    "package": {
      "id": "string",
      "name": "string",
      "category": "string",
      "description": "string",
      "version": "string",
      "size": "string",
      "status": "string",
      "iconClass": "string"
    }
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved installations
- `500 Internal Server Error` - Failed to fetch installations

---

#### Toggle Package Service

Enables or disables an installed package's service.

**Endpoint:** `PATCH /api/installations/:packageId/toggle`

**Parameters:**
- `packageId` (path) - Package ID

**Request Body:**
```json
{
  "isEnabled": boolean
}
```

**Response:**
```json
{
  "id": "string",
  "packageId": "string",
  "isEnabled": boolean,
  "memoryUsage": "string",
  "uptime": "string",
  "installDate": "ISO 8601 timestamp"
}
```

**Status Codes:**
- `200 OK` - Service toggled successfully
- `404 Not Found` - Installation not found
- `500 Internal Server Error` - Failed to toggle service

---

### System Status

#### Get System Status

Retrieves current system status including memory, storage, CPU, and active services.

**Endpoint:** `GET /api/system/status`

**Response:**
```json
{
  "id": "string",
  "memoryUsage": number,
  "memoryTotal": number,
  "storageUsage": number,
  "storageTotal": number,
  "cpuLoad": "string",
  "activeServices": number,
  "updatedAt": "ISO 8601 timestamp"
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved system status
- `500 Internal Server Error` - Failed to fetch system status

**Notes:**
- Memory values are in MB
- Storage values are in MB
- Usage values are percentages (0-100)

---

### Services

#### Get All Services

Retrieves a list of all system services.

**Endpoint:** `GET /api/services`

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "status": "running|stopped",
    "memoryUsage": "string",
    "uptime": "string",
    "iconClass": "string"
  }
]
```

**Status Codes:**
- `200 OK` - Successfully retrieved services
- `500 Internal Server Error` - Failed to fetch services

---

#### Control Service

Start, stop, or restart a system service.

**Endpoint:** `PATCH /api/services/:id/:action`

**Parameters:**
- `id` (path) - Service ID
- `action` (path) - Action to perform: `start`, `stop`, or `restart`

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "status": "running|stopped",
  "memoryUsage": "string",
  "uptime": "string",
  "iconClass": "string"
}
```

**Status Codes:**
- `200 OK` - Service action executed successfully
- `404 Not Found` - Service not found
- `500 Internal Server Error` - Failed to control service

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

or

```json
{
  "message": "Error message description"
}
```

## Notes

- All timestamps are in ISO 8601 format
- Currently using in-memory storage (data lost on server restart)
- No authentication implemented (all endpoints are public)
- CORS is not configured (same-origin only)

## Future Enhancements

- Add authentication and authorization
- Implement request validation with Zod schemas
- Add pagination for list endpoints
- Add filtering and sorting options
- Implement rate limiting
- Add WebSocket support for real-time updates
