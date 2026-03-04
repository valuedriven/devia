# Stage 1: Dependencies
FROM node:24-alpine AS deps
# Install libc6-compat for compatibility
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install project dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry disable
ENV NEXT_TELEMETRY_DISABLED=1

# Load build arguments as environment variables for the build step
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Stage 3: Runner
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set correct permissions
COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

# Leverage output traces to reduce image size (requires output: 'standalone' in next.config.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE $PORT

# Server.js is created by next build from standalone output
CMD ["node", "server.js"]
