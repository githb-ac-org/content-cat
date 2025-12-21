#!/usr/bin/env bash
#
#  ██████╗ ██████╗ ███╗   ██╗████████╗███████╗███╗   ██╗████████╗     ██████╗ █████╗ ████████╗
# ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝    ██╔════╝██╔══██╗╚══██╔══╝
# ██║     ██║   ██║██╔██╗ ██║   ██║   █████╗  ██╔██╗ ██║   ██║       ██║     ███████║   ██║
# ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══╝  ██║╚██╗██║   ██║       ██║     ██╔══██║   ██║
# ╚██████╗╚██████╔╝██║ ╚████║   ██║   ███████╗██║ ╚████║   ██║       ╚██████╗██║  ██║   ██║
#  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═══╝   ╚═╝        ╚═════╝╚═╝  ╚═╝   ╚═╝
#
# AI-powered image and video generation platform
# Installation Script for macOS and WSL/Linux
#

set -e

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════════════════════════

REPO_URL="https://github.com/KenKaiii/content-cat"
INSTALL_DIR="$HOME/content-cat"
NODE_VERSION="20"

# ══════════════════════════════════════════════════════════════════════════════
# COLORS & FORMATTING
# ══════════════════════════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
DIM='\033[2m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Symbols
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
ARROW="${CYAN}→${NC}"
WARN="${YELLOW}⚠${NC}"
INFO="${BLUE}ℹ${NC}"
ROCKET="${MAGENTA}🚀${NC}"
CAT="🐱"

# ══════════════════════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════

print_banner() {
    echo ""
    echo -e "${MAGENTA}"
    echo "  ╔═══════════════════════════════════════════════════════════════╗"
    echo "  ║                                                               ║"
    echo -e "  ║   ${WHITE}${BOLD}Content Cat${NC}${MAGENTA} ${CAT}                                           ║"
    echo "  ║   AI-powered image and video generation platform             ║"
    echo "  ║                                                               ║"
    echo "  ╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${WHITE}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

log_info() {
    echo -e "  ${INFO} ${DIM}$1${NC}"
}

log_success() {
    echo -e "  ${CHECK} $1"
}

log_warning() {
    echo -e "  ${WARN} ${YELLOW}$1${NC}"
}

log_error() {
    echo -e "  ${CROSS} ${RED}$1${NC}"
}

log_arrow() {
    echo -e "  ${ARROW} $1"
}

spinner() {
    local pid=$1
    local message=$2
    local spin='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    local i=0

    while kill -0 $pid 2>/dev/null; do
        i=$(( (i+1) % ${#spin} ))
        printf "\r  ${CYAN}${spin:$i:1}${NC} ${DIM}$message${NC}"
        sleep 0.1
    done
    printf "\r"
}

run_with_spinner() {
    local message=$1
    shift

    ("$@") &>/dev/null &
    local pid=$!
    spinner $pid "$message"
    wait $pid
    local status=$?

    if [ $status -eq 0 ]; then
        log_success "$message"
    else
        log_error "$message failed"
        return $status
    fi
}

command_exists() {
    command -v "$1" &>/dev/null
}

# ══════════════════════════════════════════════════════════════════════════════
# OS DETECTION
# ══════════════════════════════════════════════════════════════════════════════

detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        PACKAGE_MANAGER="brew"
    elif [[ -f /proc/version ]] && grep -qi microsoft /proc/version; then
        OS="wsl"
        if command_exists apt-get; then
            PACKAGE_MANAGER="apt"
        elif command_exists dnf; then
            PACKAGE_MANAGER="dnf"
        else
            PACKAGE_MANAGER="apt"
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        if command_exists apt-get; then
            PACKAGE_MANAGER="apt"
        elif command_exists dnf; then
            PACKAGE_MANAGER="dnf"
        elif command_exists pacman; then
            PACKAGE_MANAGER="pacman"
        else
            PACKAGE_MANAGER="apt"
        fi
    else
        log_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# ══════════════════════════════════════════════════════════════════════════════
# DEPENDENCY INSTALLATION
# ══════════════════════════════════════════════════════════════════════════════

install_homebrew() {
    if ! command_exists brew; then
        log_info "Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        # Add Homebrew to PATH for this session
        if [[ "$OS" == "macos" ]]; then
            if [[ -f /opt/homebrew/bin/brew ]]; then
                eval "$(/opt/homebrew/bin/brew shellenv)"
            elif [[ -f /usr/local/bin/brew ]]; then
                eval "$(/usr/local/bin/brew shellenv)"
            fi
        fi
        log_success "Homebrew installed"
    else
        log_success "Homebrew already installed"
    fi
}

install_git() {
    if command_exists git; then
        log_success "Git already installed ($(git --version | cut -d' ' -f3))"
        return
    fi

    log_info "Installing Git..."
    case $PACKAGE_MANAGER in
        brew) brew install git ;;
        apt) sudo apt-get update && sudo apt-get install -y git ;;
        dnf) sudo dnf install -y git ;;
        pacman) sudo pacman -S --noconfirm git ;;
    esac
    log_success "Git installed"
}

install_node() {
    local current_version=""

    if command_exists node; then
        current_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [[ "$current_version" -ge "$NODE_VERSION" ]]; then
            log_success "Node.js already installed (v$(node --version | cut -d'v' -f2))"
            return
        fi
        log_warning "Node.js version $current_version found, but v$NODE_VERSION+ required"
    fi

    log_info "Installing Node.js v$NODE_VERSION..."

    # Install via nvm for better version management
    if ! command_exists nvm; then
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

        # Load nvm for this session
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi

    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
    nvm alias default $NODE_VERSION

    log_success "Node.js v$(node --version | cut -d'v' -f2) installed"
}

install_pnpm() {
    if command_exists pnpm; then
        log_success "pnpm already installed (v$(pnpm --version))"
        return
    fi

    log_info "Installing pnpm..."

    # Use corepack if available (comes with Node.js 16.13+)
    if command_exists corepack; then
        corepack enable
        corepack prepare pnpm@latest --activate
    else
        npm install -g pnpm
    fi

    log_success "pnpm installed (v$(pnpm --version))"
}

install_postgresql() {
    if command_exists psql; then
        log_success "PostgreSQL already installed"
        return
    fi

    log_info "Installing PostgreSQL..."

    case $PACKAGE_MANAGER in
        brew)
            brew install postgresql@16
            brew services start postgresql@16
            ;;
        apt)
            sudo apt-get update
            sudo apt-get install -y postgresql postgresql-contrib
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
        dnf)
            sudo dnf install -y postgresql-server postgresql-contrib
            sudo postgresql-setup --initdb
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
        pacman)
            sudo pacman -S --noconfirm postgresql
            sudo -u postgres initdb -D /var/lib/postgres/data
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
    esac

    log_success "PostgreSQL installed"
}

install_redis() {
    if command_exists redis-cli; then
        log_success "Redis already installed"
        return
    fi

    log_info "Installing Redis (optional - for production caching)..."

    case $PACKAGE_MANAGER in
        brew)
            brew install redis
            # Don't start by default - it's optional
            log_info "Run 'brew services start redis' to start Redis"
            ;;
        apt)
            sudo apt-get update
            sudo apt-get install -y redis-server
            ;;
        dnf)
            sudo dnf install -y redis
            ;;
        pacman)
            sudo pacman -S --noconfirm redis
            ;;
    esac

    log_success "Redis installed (optional service)"
}

install_docker() {
    if command_exists docker; then
        log_success "Docker already installed ($(docker --version | cut -d' ' -f3 | tr -d ','))"
        return
    fi

    log_info "Installing Docker..."

    case $OS in
        macos)
            if [[ "$PACKAGE_MANAGER" == "brew" ]]; then
                brew install --cask docker
                log_success "Docker Desktop installed"
                log_warning "Please open Docker Desktop from Applications to complete setup"
            fi
            ;;
        wsl)
            log_info "For WSL, Docker Desktop for Windows is recommended"
            log_arrow "Download from: https://www.docker.com/products/docker-desktop"
            log_info "Alternatively, installing Docker Engine..."

            # Install Docker Engine for WSL
            sudo apt-get update
            sudo apt-get install -y ca-certificates curl gnupg lsb-release

            # Add Docker's official GPG key
            sudo mkdir -p /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

            # Set up repository (detect Ubuntu/Debian version in WSL)
            local distro=$(. /etc/os-release && echo "$ID")
            local version_codename=$(. /etc/os-release && echo "$VERSION_CODENAME")

            echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$distro $version_codename stable" | \
                sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

            sudo apt-get update
            sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

            # Add user to docker group
            sudo usermod -aG docker $USER
            log_warning "Log out and back in for Docker group changes to take effect"
            log_success "Docker Engine installed"
            ;;
        linux)
            case $PACKAGE_MANAGER in
                apt)
                    sudo apt-get update
                    sudo apt-get install -y ca-certificates curl gnupg lsb-release

                    sudo mkdir -p /etc/apt/keyrings
                    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

                    local distro=$(. /etc/os-release && echo "$ID")
                    local version_codename=$(. /etc/os-release && echo "$VERSION_CODENAME")

                    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$distro $version_codename stable" | \
                        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

                    sudo apt-get update
                    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
                    ;;
                dnf)
                    sudo dnf -y install dnf-plugins-core
                    sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
                    sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
                    sudo systemctl start docker
                    sudo systemctl enable docker
                    ;;
                pacman)
                    sudo pacman -S --noconfirm docker docker-compose
                    sudo systemctl start docker
                    sudo systemctl enable docker
                    ;;
            esac

            sudo usermod -aG docker $USER
            log_warning "Log out and back in for Docker group changes to take effect"
            log_success "Docker installed"
            ;;
    esac
}

# ══════════════════════════════════════════════════════════════════════════════
# DATABASE SETUP
# ══════════════════════════════════════════════════════════════════════════════

setup_database() {
    print_step "Setting up PostgreSQL database"

    local db_name="content_cat"
    local db_user="content_cat"
    local db_pass=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)

    log_info "Creating database user and database..."

    # Create user and database
    if [[ "$OS" == "macos" ]]; then
        # macOS: use current user as superuser
        createuser -s $db_user 2>/dev/null || true
        createdb -O $db_user $db_name 2>/dev/null || true
        psql -c "ALTER USER $db_user WITH PASSWORD '$db_pass';" 2>/dev/null || true
    else
        # Linux/WSL: use postgres user
        sudo -u postgres psql -c "CREATE USER $db_user WITH PASSWORD '$db_pass';" 2>/dev/null || true
        sudo -u postgres psql -c "CREATE DATABASE $db_name OWNER $db_user;" 2>/dev/null || true
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $db_user;" 2>/dev/null || true
    fi

    # Save credentials for later
    DB_URL="postgresql://$db_user:$db_pass@localhost:5432/$db_name?schema=public"

    log_success "Database '$db_name' created"
    log_info "Database URL saved for .env configuration"
}

# ══════════════════════════════════════════════════════════════════════════════
# PROJECT SETUP
# ══════════════════════════════════════════════════════════════════════════════

clone_repository() {
    print_step "Downloading Content Cat"

    if [[ -d "$INSTALL_DIR" ]]; then
        log_warning "Directory $INSTALL_DIR already exists"
        read -p "  Do you want to remove it and start fresh? [y/N] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$INSTALL_DIR"
        else
            log_info "Using existing directory"
            cd "$INSTALL_DIR"
            return
        fi
    fi

    log_info "Cloning repository..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    cd "$INSTALL_DIR"

    log_success "Repository cloned to $INSTALL_DIR"
}

install_dependencies() {
    print_step "Installing project dependencies"

    cd "$INSTALL_DIR"

    log_info "Installing npm packages with pnpm..."
    pnpm install

    log_success "Dependencies installed"
}

setup_environment() {
    print_step "Configuring environment"

    cd "$INSTALL_DIR"

    # Generate secrets
    local session_secret=$(openssl rand -hex 32)
    local cron_secret=$(openssl rand -hex 16)
    local encryption_key=$(openssl rand -hex 32)

    # Create .env file
    cat > .env << EOF
# ═══════════════════════════════════════════════════════════════════════════════
# Content Cat - Environment Configuration
# Generated by install script on $(date)
# ═══════════════════════════════════════════════════════════════════════════════

# Database Configuration
DATABASE_URL="$DB_URL"

# Node Environment
NODE_ENV="development"

# Session Configuration
SESSION_SECRET="$session_secret"
SESSION_EXPIRY_DAYS=7

# Rate Limiting (optional - uncomment for Redis in production)
# REDIS_URL="redis://localhost:6379"

# Cron Job Authentication
CRON_SECRET="$cron_secret"

# Encryption Key for API keys at rest (64 hex chars = 256 bits)
ENCRYPTION_KEY="$encryption_key"

# ═══════════════════════════════════════════════════════════════════════════════
# External Services
# Add your API keys below or configure them in the app settings
# ═══════════════════════════════════════════════════════════════════════════════

# FAL.ai API Key (for image/video generation)
# Get your key at: https://fal.ai/dashboard/keys
# FAL_KEY="your-fal-api-key"
EOF

    log_success ".env file created with secure defaults"
}

setup_prisma() {
    print_step "Setting up database schema"

    cd "$INSTALL_DIR"

    log_info "Generating Prisma client..."
    pnpm prisma generate

    log_info "Running database migrations..."
    pnpm prisma db push

    log_success "Database schema applied"
}

# ══════════════════════════════════════════════════════════════════════════════
# FINAL STEPS
# ══════════════════════════════════════════════════════════════════════════════

print_success() {
    echo ""
    echo -e "${GREEN}"
    echo "  ╔═══════════════════════════════════════════════════════════════╗"
    echo "  ║                                                               ║"
    echo -e "  ║   ${WHITE}${BOLD}Installation Complete!${NC}${GREEN} ${CAT}                                 ║"
    echo "  ║                                                               ║"
    echo "  ╚═══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    echo -e "${WHITE}${BOLD}  Next Steps:${NC}"
    echo ""
    echo -e "  ${ARROW} ${WHITE}1.${NC} Navigate to your project:"
    echo -e "     ${DIM}cd $INSTALL_DIR${NC}"
    echo ""
    echo -e "  ${ARROW} ${WHITE}2.${NC} Add your FAL.ai API key (optional):"
    echo -e "     ${DIM}Edit .env and add your FAL_KEY${NC}"
    echo -e "     ${DIM}Or configure it later in the app settings${NC}"
    echo ""
    echo -e "  ${ARROW} ${WHITE}3.${NC} Start the development server:"
    echo -e "     ${DIM}pnpm dev${NC}"
    echo ""
    echo -e "  ${ARROW} ${WHITE}4.${NC} Open your browser:"
    echo -e "     ${CYAN}http://localhost:3000${NC}"
    echo ""
    echo -e "${DIM}  ─────────────────────────────────────────────────────────────────${NC}"
    echo ""
    echo -e "  ${INFO} ${DIM}Documentation:${NC} ${CYAN}https://github.com/UnstableMind/content-cat${NC}"
    echo -e "  ${INFO} ${DIM}Get FAL.ai key:${NC} ${CYAN}https://fal.ai/dashboard/keys${NC}"
    echo ""
}

print_troubleshooting() {
    echo ""
    echo -e "${YELLOW}${BOLD}  Troubleshooting:${NC}"
    echo ""
    echo -e "  ${WARN} If PostgreSQL connection fails:"
    echo -e "     ${DIM}Check if PostgreSQL is running:${NC}"
    if [[ "$OS" == "macos" ]]; then
        echo -e "     ${DIM}  brew services list${NC}"
    else
        echo -e "     ${DIM}  sudo systemctl status postgresql${NC}"
    fi
    echo ""
    echo -e "  ${WARN} If you get permission errors:"
    echo -e "     ${DIM}Try running: chmod +x scripts/install.sh${NC}"
    echo ""
}

# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

main() {
    print_banner

    echo -e "  ${INFO} ${DIM}This script will install Content Cat and all dependencies.${NC}"
    echo -e "  ${INFO} ${DIM}You may be prompted for your password for system packages.${NC}"
    echo ""

    # Detect operating system
    detect_os
    log_info "Detected OS: $OS (package manager: $PACKAGE_MANAGER)"

    # Ask for confirmation
    read -p "  Continue with installation? [Y/n] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Nn]$ ]]; then
        log_info "Installation cancelled"
        exit 0
    fi

    # Install system dependencies
    print_step "Installing system dependencies"

    if [[ "$OS" == "macos" ]] || [[ "$PACKAGE_MANAGER" == "brew" ]]; then
        install_homebrew
    fi

    install_git
    install_node
    install_pnpm
    install_postgresql
    install_redis
    install_docker

    # Setup database
    setup_database

    # Clone and setup project
    clone_repository
    install_dependencies
    setup_environment
    setup_prisma

    # Done!
    print_success
    print_troubleshooting
}

# Run main function
main "$@"
