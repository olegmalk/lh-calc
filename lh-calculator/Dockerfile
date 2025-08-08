# Multi-stage build for production optimization
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies for building
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false --silent

# Copy source code
COPY . .

# Build application
RUN npm run build:prod

# Production stage
FROM nginx:alpine AS production

# Install security updates
RUN apk upgrade --no-cache

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy nginx configuration
COPY deploy/nginx.conf /etc/nginx/nginx.conf
COPY deploy/nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Copy health check script
COPY deploy/health-check.sh /usr/local/bin/health-check.sh
RUN chmod +x /usr/local/bin/health-check.sh

# Security hardening
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nextjs:nodejs /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d /var/run

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD /usr/local/bin/health-check.sh

# Start nginx
CMD ["nginx", "-g", "daemon off;"]