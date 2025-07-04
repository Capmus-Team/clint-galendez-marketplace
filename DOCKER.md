# Docker Setup for Next.js Application

This directory contains Docker configuration files for running your Next.js application in containers.

## Files Created

- `Dockerfile` - Multi-stage Docker build for the Next.js application
- `docker-compose.yml` - Production setup with Nginx reverse proxy
- `docker-compose.dev.yml` - Simplified development setup
- `nginx.conf` - Nginx configuration for reverse proxy
- `.dockerignore` - Files to exclude from Docker build context

## Prerequisites

- Docker and Docker Compose installed on your system
- Your `.env` file should be present in the project root with all required environment variables
- Make sure your `.env` file contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`)

## Quick Start

### Development Setup (Recommended for testing)

```bash
# Make sure your .env file is present and contains the required variables
# Build and run the application
docker-compose -f docker-compose.dev.yml up --build

# Run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build

# Stop the containers
docker-compose -f docker-compose.dev.yml down
```

The application will be available at `http://localhost:3000`

### Production Setup (with Nginx)

```bash
# Build and run with Nginx reverse proxy
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop the containers
docker-compose down
```

The application will be available at:
- `http://localhost` (port 80, proxied through Nginx)
- `http://localhost:3000` (direct access to Next.js app)

## Configuration Details

### Dockerfile
- Uses Node.js 18 Alpine for smaller image size
- Multi-stage build for optimization
- Enables Next.js standalone output for better performance
- Runs as non-root user for security

### Environment Variables
The Docker setup uses environment variables from your `.env` file. The most critical ones for the build process are:
- `NEXT_PUBLIC_SUPABASE_URL` - Required during build time
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Required during build time
- Other Supabase configuration variables
- Database credentials
- SendGrid API keys

**Important**: Make sure your `.env` file contains all required variables before building. See `.env.example` for reference.

### Build-time vs Runtime Variables
- Variables prefixed with `NEXT_PUBLIC_` are needed during Docker build time
- Other variables are only needed at runtime
- The Dockerfile passes the public variables as build arguments to ensure they're available during the build process

### Nginx Configuration
- Reverse proxy to the Next.js application
- Gzip compression enabled
- Security headers included
- Static asset caching
- Health check endpoint at `/health`

## Customization

### SSL/HTTPS Setup
To enable HTTPS:
1. Uncomment the HTTPS server block in `nginx.conf`
2. Place your SSL certificates in a `ssl/` directory
3. Update the certificate paths in the nginx configuration

### Environment-specific Builds
You can create different docker-compose files for different environments:
- `docker-compose.dev.yml` - Development
- `docker-compose.staging.yml` - Staging
- `docker-compose.prod.yml` - Production

## Troubleshooting

### Build Issues
If you encounter build issues:
```bash
# Clean up and rebuild
docker-compose down --volumes --remove-orphans
docker system prune -f
docker-compose up --build --force-recreate
```

### Check Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs app
docker-compose logs nginx
```

### Access Container Shell
```bash
# Access the app container
docker-compose exec app sh

# Access the nginx container
docker-compose exec nginx sh
```

## Performance Notes

- The Dockerfile uses Next.js standalone output for optimal performance
- Static assets are cached by Nginx for 1 year
- Gzip compression is enabled for better transfer speeds
- The image uses Alpine Linux for smaller size

## Security Notes

- Application runs as non-root user (nextjs:nodejs)
- Nginx includes security headers
- Environment variables are properly passed to containers
- `.dockerignore` excludes sensitive files from build context
