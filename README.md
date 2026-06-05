# WebSockets Maps Application — Server

[![Bun](https://img.shields.io/badge/Runtime-Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Zod](https://img.shields.io/badge/Validation-Zod-3E67B1?style=flat&logo=zod&logoColor=white)](https://zod.dev/)

The backend for the WebSockets Maps Application — a high-performance WebSocket server built with Bun that broadcasts real-time location and connection events to all clients.

> The client is in a separate repository: [WebSockets-Maps-client](https://github.com/mikeislas06/WebSockets-Maps-client).

## Table of Contents

- [Technologies](#technologies)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Scripts](#scripts)
- [Project Structure](#project-structure)

## Technologies

- **Runtime & WebSockets:** Bun
- **Language:** TypeScript
- **Validation:** Zod
- **Architecture:** Class-based stores and service handlers

## Features

- High-performance, native WebSocket handling using Bun's built-in server
- Message payload validation using Zod schemas
- Centralized state management for all connected clients and their coordinates
- Structured message handling for client joins, movements, and disconnects

## Prerequisites

- [Bun](https://bun.sh/) installed locally
- The client running locally or deployed (see [WebSockets-Maps-client](https://github.com/mikeislas06/WebSockets-Maps-client))

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/mikeislas06/WebSockets-Maps-server.git
cd WebSockets-Maps-server
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server (with hot reload):

```bash
bun run dev
```

The server will start listening for WebSocket connections (default on port 3000).

## Scripts

| Script          | Description                                   |
| --------------- | --------------------------------------------- |
| `bun run dev`   | Start server with hot-reloading               |
| `bun run start` | Start server for production                   |

## Project Structure

```
server/
├── public/               # Public assets (e.g., fallback HTML)
├── src/                  # Source code
│   ├── handlers/         # Message and event handlers
│   ├── schemas/          # Zod validation schemas
│   ├── services/         # Business logic services
│   ├── store/            # In-memory data store for connected clients
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Helper utilities (e.g., UUID generation)
│   ├── index.ts          # Server entry point
│   └── server.ts         # Bun server configuration and WebSocket setup
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```
