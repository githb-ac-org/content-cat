# Content Cat v{VERSION}

<div align="center">

![Content Cat](https://raw.githubusercontent.com/UnstableMind/content-cat/main/public/logo.png)

**AI-powered image and video generation platform**

[Documentation](https://github.com/KenKaiii/content-cat#readme) · [Report Bug](https://github.com/KenKaiii/content-cat/issues) · [Request Feature](https://github.com/KenKaiii/content-cat/issues)

</div>

---

## Quick Install

### One-Line Install (macOS & Linux/WSL)

```bash
curl -fsSL https://raw.githubusercontent.com/UnstableMind/content-cat/main/scripts/install.sh | bash
```

This script will automatically:
- Install all required dependencies (Node.js, pnpm, PostgreSQL, Redis, Docker)
- Clone the repository
- Set up the database
- Generate secure environment configuration
- Prepare everything for first run

---

## What's New

### Features
- {FEATURE_1}
- {FEATURE_2}

### Improvements
- {IMPROVEMENT_1}
- {IMPROVEMENT_2}

### Bug Fixes
- {FIX_1}
- {FIX_2}

---

## Manual Installation

If you prefer manual installation:

### Prerequisites

| Dependency | Version | Required |
|------------|---------|----------|
| Node.js | 20+ | Yes |
| pnpm | 9+ | Yes |
| PostgreSQL | 15+ | Yes |
| Redis | 7+ | Optional |
| Docker | 24+ | Optional |

### Steps

```bash
# Clone the repository
git clone https://github.com/KenKaiii/content-cat.git
cd content-cat

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env
# Edit .env with your configuration

# Set up database
pnpm prisma generate
pnpm prisma db push

# Start development server
pnpm dev
```

---

## Docker Installation

For production deployment with Docker:

```bash
# Clone and enter directory
git clone https://github.com/KenKaiii/content-cat.git
cd content-cat

# Copy and configure environment
cp .env.example .env

# Start all services
docker compose --profile production up -d
```

---

## System Requirements

### Minimum
- **OS:** macOS 12+, Ubuntu 20.04+, Windows 10+ (WSL2)
- **RAM:** 4GB
- **Storage:** 2GB free space
- **Network:** Internet connection for AI generation

### Recommended
- **RAM:** 8GB+
- **Storage:** 10GB+ (for cached assets)

---

## Configuration

After installation, configure your API keys in the `.env` file or through the app settings:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `FAL_KEY` | FAL.ai API key for generation | Yes* |
| `SESSION_SECRET` | Secure session key | Yes |
| `REDIS_URL` | Redis connection (optional) | No |

*Can be configured in app settings instead

Get your FAL.ai API key at: https://fal.ai/dashboard/keys

---

## Checksums

```
SHA256 (install.sh) = {SHA256_INSTALL}
```

---

## Support

- **Issues:** [GitHub Issues](https://github.com/KenKaiii/content-cat/issues)
- **Discussions:** [GitHub Discussions](https://github.com/KenKaiii/content-cat/discussions)

---

<div align="center">

Made with love by the Content Cat team

</div>
