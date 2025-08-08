# LH Calculator - Production Deployment Guide

## Overview

Complete production deployment pipeline for the LH Calculator application with Docker, CI/CD, monitoring, and automated deployment scripts.

## Production Architecture

- **Application**: React + TypeScript + Vite
- **Container**: Docker with multi-stage build
- **Web Server**: Nginx (reverse proxy + static files)
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Custom health checks
- **SSL**: Let's Encrypt via Traefik

## Quick Start

### Prerequisites

1. Docker and Docker Compose installed
2. Production environment variables configured
3. SSL certificates (if not using Traefik)

### Environment Setup

1. Copy environment template:

```bash
cp .env.production .env.production.local
```

2. Configure production variables:

```bash
# Required: Bitrix24 integration
VITE_BITRIX24_WEBHOOK_URL=your_webhook_url
VITE_BITRIX24_DOMAIN=your_domain
VITE_BITRIX24_APP_ID=your_app_id
VITE_BITRIX24_APP_SECRET=your_app_secret

# Optional: Monitoring
VITE_SENTRY_DSN=your_sentry_dsn
VITE_GA_ID=your_google_analytics_id
```

### Deployment Commands

#### Local Production Build

```bash
# Build production bundle
npm run build:prod

# Build Docker image
npm run docker:build

# Run container
npm run docker:run
```

#### Server Deployment

```bash
# Deploy to production
./scripts/deploy.sh

# Deploy specific version
./scripts/deploy.sh sha-abc1234

# Health check
./scripts/health-check.sh --detailed

# Create backup
./scripts/backup.sh --full

# Emergency rollback
./scripts/rollback.sh latest
```

## CI/CD Pipeline

### GitHub Actions Workflow

The deployment pipeline includes:

1. **Test Stage**: Unit tests, E2E tests, linting
2. **Security**: Vulnerability scanning with Trivy
3. **Build**: Docker image build and push to registry
4. **Deploy**: Automated deployment to production server
5. **Verify**: Health checks and smoke tests
6. **Rollback**: Automatic rollback on failure

### Required Secrets

Configure these in GitHub repository settings:

```
PRODUCTION_SSH_KEY          # SSH private key for server access
PRODUCTION_HOST             # Production server hostname/IP
PRODUCTION_USER             # SSH username
SLACK_WEBHOOK              # Slack notifications (optional)
```

## Monitoring & Health Checks

### Health Check Endpoints

- `GET /health` - Application health status
- `GET /` - Main application
- Container health check via Docker

### Monitoring Stack

- **Prometheus**: Metrics collection
- **Custom monitoring**: Performance, errors, usage analytics
- **Alerting**: System resources, error rates, response times

### Health Check Commands

```bash
# Basic health check
./scripts/health-check.sh

# Detailed health information
./scripts/health-check.sh --detailed

# Custom URL
./scripts/health-check.sh --url=https://your-domain.com
```

## Security Features

### Container Security

- Non-root user execution
- Security headers via Nginx
- Resource limits
- Health checks

### Network Security

- HTTPS only in production
- CSP headers
- Rate limiting
- CORS configuration

### Data Security

- Environment variables for secrets
- No sensitive data in logs
- Secure backup procedures

## Performance Optimizations

### Build Optimizations

- Code splitting by vendor chunks
- Terser minification
- Tree shaking
- Source map exclusion in production

### Runtime Optimizations

- Nginx compression (Gzip + Brotli)
- Static file caching
- CDN-ready asset structure
- Lazy loading

### Monitoring

- Performance metrics tracking
- Error tracking and reporting
- Usage analytics (privacy-friendly)

## Backup & Recovery

### Backup Types

```bash
# Configuration only
./scripts/backup.sh --config-only

# Standard backup (config + container state)
./scripts/backup.sh

# Full backup (includes volumes)
./scripts/backup.sh --full
```

### Backup Contents

- Configuration files
- Container state and logs
- Application data
- SSL certificates
- Docker volumes (full backup only)

### Recovery Process

```bash
# List available backups
./scripts/rollback.sh

# Rollback to specific backup
./scripts/rollback.sh 20240808_143000

# Rollback to latest backup
./scripts/rollback.sh latest
```

## Production Checklist

### Pre-Deployment

- [ ] All tests passing locally
- [ ] Production environment variables configured
- [ ] SSL certificates ready
- [ ] Backup of current production
- [ ] Deployment plan reviewed

### Deployment

- [ ] Deploy via automated pipeline or manual script
- [ ] Health checks pass
- [ ] Smoke tests successful
- [ ] Performance metrics normal
- [ ] Error rates within limits

### Post-Deployment

- [ ] Application accessible via production URL
- [ ] All features working correctly
- [ ] Monitoring systems active
- [ ] Team notified of successful deployment
- [ ] Documentation updated if needed

## Troubleshooting

### Common Issues

1. **Container fails to start**
   - Check environment variables
   - Review container logs: `docker-compose logs lh-calculator`
   - Verify resource limits

2. **Health checks failing**
   - Check application logs
   - Verify network connectivity
   - Test endpoints manually

3. **Build failures**
   - Check dependencies
   - Verify Node.js version
   - Review build logs

### Emergency Procedures

1. **Application down**: Use rollback script
2. **Performance issues**: Check monitoring dashboards
3. **Security incident**: Review logs and update secrets

## Maintenance

### Regular Tasks

- Monitor system resources
- Review error logs
- Update dependencies
- Clean old backups
- Renew SSL certificates

### Updates

- Test in staging environment
- Use blue-green deployment
- Monitor post-deployment metrics
- Keep rollback plan ready

## Support

For deployment issues:

1. Check health status: `./scripts/health-check.sh --detailed`
2. Review recent logs: `docker-compose logs --tail=100`
3. Check system resources and monitoring
4. Consider rollback if critical issue
