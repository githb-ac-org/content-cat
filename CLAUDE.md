# Content Cat

AI-powered image and video generation platform with a visual workflow builder for creating stunning visuals and cinematic content.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # REST API endpoints
│   │   ├── auth/           # Authentication (login, logout, session)
│   │   ├── characters/     # Character CRUD
│   │   ├── files/          # File operations
│   │   ├── generate-image/ # Image generation
│   │   ├── generate-video/ # Video generation
│   │   ├── images/         # Image management
│   │   ├── products/       # Product management
│   │   ├── upload/         # File upload handler
│   │   ├── video-edit/     # Video editing
│   │   ├── videos/         # Video management
│   │   └── workflows/      # Workflow management
│   ├── create-character/   # Character creation page
│   ├── image/              # Image generation UI
│   ├── video/              # Video generation UI
│   ├── workflow/           # Workflow builder UI
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── workflow/           # Workflow editor components
│   │   ├── nodes/          # Node types
│   │   ├── edges/          # Edge/connection components
│   │   └── properties/     # Property panels
│   ├── video/              # Video-related components
│   └── image/              # Image-related components
├── lib/                    # Utilities & services
│   ├── api/                # API client utilities
│   ├── fal/                # FAL.ai integration
│   ├── services/           # Business logic
│   ├── utils/              # General utilities
│   └── video-editor/       # Video editing utilities
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript definitions
prisma/                     # Database schema & migrations
```

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI Services**: FAL.ai for image/video generation
- **Workflow**: @xyflow/react, @dagrejs/dagre
- **Canvas**: Konva, react-konva
- **Styling**: Tailwind CSS 4
- **Caching**: Redis (ioredis)

## Organization Rules

- API routes → `src/app/api/`, one route per resource
- Components → `src/components/`, grouped by feature
- Utilities → `src/lib/`, grouped by functionality
- Hooks → `src/hooks/`, one hook per file
- Types → `src/types/` or co-located

## Code Quality - Zero Tolerance

After editing ANY file, run:

```bash
pnpm lint && pnpm typecheck
```

Fix ALL errors/warnings before continuing.

For dev server changes:
```bash
pnpm dev
```

Read server output and fix ALL warnings/errors.

## Releases

### Creating a Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

This triggers `.github/workflows/release.yml` which:
- Creates a GitHub release with install instructions
- Attaches `scripts/install.sh` with SHA256 checksum
- Auto-generates release notes from commits

### Install Script

Users install with:
```bash
curl -fsSL https://raw.githubusercontent.com/KenKaiii/content-cat/main/scripts/install.sh | bash
```

The script (`scripts/install.sh`) handles:
- OS detection (macOS, WSL, Linux)
- Package manager detection (brew, apt, dnf, pacman)
- Dependencies: Node.js 20+, pnpm, PostgreSQL, Redis, Docker
- Database setup and Prisma migrations
- Secure `.env` generation
- Global `content-cat` CLI command

### Global CLI Commands

After install, users can run:
```bash
content-cat start       # Start dev server
content-cat docker      # Start with Docker (production)
content-cat docker:db   # Start database services only
content-cat update      # Pull latest and update deps
content-cat stop        # Stop all services
content-cat db:studio   # Open Prisma Studio
content-cat help        # Show all commands
```

### Docker Deployment

```bash
# Development (DB only)
docker compose up -d postgres redis

# Production (full stack)
docker compose --profile production up -d
```

Files:
- `Dockerfile` - Multi-stage production build
- `docker-compose.yml` - PostgreSQL, Redis, app services
