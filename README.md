# 🧊 Mindchain

**Mindchain** is a high-performance, open-source alternative to Jira and Confluence, designed as a unified workspace for documentation (Pages) and project management (Issues). 

Built with the "Linear" / "Raycast" aesthetic in mind, Mindchain provides a clean, minimalist, and distraction-free environment for engineering teams to sync their thoughts and tasks.


---

## 🚀 The Vision

Modern product development is often fragmented between "where we think" (documentation) and "where we act" (task tracking). Mindchain bridges this gap by connecting documentation to issues in a single, seamless interface.

- **The Mind (Knowledge Base)**: A Notion-like rich text editor for technical specs, roadmaps, and meeting notes.
- **The Chain (Project Management)**: A high-velocity Kanban board with rich issue tracking (Title, Description, Priority).
- **The Link**: Every issue can be linked to a page, and every page can show relevant issues, ensuring context is never lost.
- **The Shield**: Enterprise-grade Row Level Security (RLS) ensures your data is private and secure.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Auth**: [Supabase](https://supabase.com/) (PostgreSQL, RLS, Realtime)
- **Editor**: [TipTap](https://tiptap.dev/) (Collaborative Rich-Text)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)

---

## 🗺️ Roadmap

### Phase 1: Foundation & MVP (Current)
- [x] **Universal Sidebar**: Collapsible navigation with workspace switcher and nested page trees.
- [x] **Hybrid Workspace**: Instant switching between Documentation and Kanban board views.
- [x] **Dark Mode First**: High-contrast, premium aesthetic optimized for long focus sessions.
- [x] **Performance**: Optimized for speed with Next.js SSR and client-side transitions.
- [x] **Database Schema**: Core PostgreSQL tables for Workspaces, Pages, and Issues.

### Phase 2: Collaboration & Real-time
- [x] **TipTap Integration**: Full collaborative, Notion-like rich text editor.
- [x] **Real-time Synchronization**: Live updates for issues and documentation via Supabase Realtime.
- [x] **Slash Commands & Floating Menus**: Insert formatting and blocks instantly.
- [x] **Relational Linking**: Connect documentation pages directly to Kanban cards.

### Phase 3: Cosmic Identity & Auth
- [x] **Cosmic Landing Page**: High-fidelity galaxy-themed entry point.
- [x] **Supabase Auth Integration**: Secure Sign In and Create Account flows.
- [x] **ALT Branding**: Recognized as a product of Artificial Ledger Technology.
- [x] **Session Management**: Intelligent redirection between Landing and Dashboard.

### Phase 6: Core Workflow Enhancements
- [x] **Rich Issue Tracker**: Replaced prompts with integrated modals for deep task management.
- [x] **Full CRUD Lifecycle**: Edit and Delete issues directly from the board.
- [x] **Security Hardening**: Implemented granular RLS policies for complete data isolation.
- [x] **Integrated Creation Triggers**: Global "New" button and sidebar shortcuts for instant action.
- [x] **Implementation**: Need to update the overall architecture workflow
---

## 📂 Project Structure

```text 🧊 Mindchain
mindchain/
├── src/
│   ├── app/            # Next.js App Router (Layouts, Pages)
│   ├── components/     # UI Components (Sidebar, Editor, etc.)
│   ├── context/        # Auth and Global State Context
│   ├── hooks/          # Custom Hooks (useRealtime)
│   ├── lib/            # Utilities (Supabase Client)
│   ├── providers/      # Context/Query Providers
│   └── services/       # Data Access Layer (Pages, Issues)
│
├── public/             # Static assets
├── supabase_schema.sql # Database definition for Supabase
└── tailwind.config.js  # Styling configuration
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or later
- Supabase Project (Free tier works great!)

### Installation & Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/flexycode/CCMETHOD_ALT-Mindchain.git
   cd CCMETHOD_ALT-Mindchain
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the root and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Database Setup**:
   Copy the content of `supabase_schema.sql` and run it in your **Supabase SQL Editor**. This sets up the tables, RLS policies, and Realtime publications.

4. **Launch**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to start using Mindchain.

---

## 🏛️ Database Schema

The core schema is built around three primary entities:

1. **Workspaces**: The top-level container for projects and teams.
2. **Pages**: Nested documentation tree with JSON content support.
3. **Issues**: Task tracking with Status (Backlog, Todo, In Progress, Done) and Priority (Low, Med, High).

Full schema details can be found in `supabase_schema.sql`.

---

## 📜 License

Copyright (c) 2026 Jay Arre P. Talosig | Artificial Ledger Technology

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
