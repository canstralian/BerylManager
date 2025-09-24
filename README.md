# BerylManager

![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Postgres](https://img.shields.io/badge/PostgreSQL-Drizzle_ORM-lightblue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![OpenWRT](https://img.shields.io/badge/OpenWRT-Beryl_AX-darkred.svg)

---

### 🔧 Manage Your Router Like a Pro

BerylManager is a **modern package and plugin manager** built for **GL.iNet Beryl AX routers**.  
Think of it as a **control center for OpenWRT** — a clean web dashboard where you can **browse, install, and manage packages** without diving into the command line.

- 📦 One-click package installs  
- 📊 Real-time system monitoring  
- 🔄 Service management (start/stop/restart)  
- 🔐 Secure session-based login  
- 🎨 A polished, responsive UI  

If you’ve ever wanted your router to feel more like an **app store**, this is it.

---

## 🏗️ Architecture at a Glance

**Frontend** → React + TypeScript + Tailwind + shadcn/ui  
**Backend** → Node.js + Express + TypeScript  
**Database** → PostgreSQL with Drizzle ORM (Neon-hosted in production)  
**Auth** → Cookie sessions with pg-backed storage  
**Dev Tools** → Vite, pnpm, ESBuild  

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL (local or [Neon](https://neon.tech/))
- pnpm (recommended)

### Setup
```bash
git clone https://github.com/canstralian/BerylManager.git
cd BerylManager
pnpm install
```
Create a .env file:
```bash
DATABASE_URL=postgres://user:password@host/db
SESSION_SECRET=super_secret_key
```
Run database migrations:
```bash
pnpm drizzle-kit migrate
```
Start development:
```bash
pnpm dev
```

⸻

🤝 How to Contribute

BerylManager is still young — and it grows best with community input.
Here’s how you can help:
  •	🐛 Report issues or request features in Issues
  •	🔧 Submit pull requests (bug fixes, UI improvements, docs updates welcome!)
  •	📖 Improve documentation or share router-specific guides
  •	🌍 Help test across different GL.iNet models

Contributions don’t need to be code — feedback, testing, and ideas are just as valuable.

⸻

🛠️ Roadmap
  •	Smarter package search & recommendations
  •	Visual graphs for service dependencies
  •	Offline package cache
  •	Role-based access control
  •	Broader GL.iNet model support

⸻

📄 License

Licensed under the Apache 2.0 License. Free to use, modify, and share.

⸻

🌟 Join the Project

If you believe routers deserve the same polish as our everyday apps —
star this repo, fork it, and make it yours. Let’s build the OpenWRT experience we always wanted.



