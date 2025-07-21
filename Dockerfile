# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 2. Build app
FROM node:20-alpine AS builder
WORKDIR /app

# Re-declare build-time args
ARG NEXT_PUBLIC_API_KEY
ARG AUTH_DOMAIN
ARG PROJECT_ID
ARG NEXT_PUBLIC_STORAGE_BUCKET
ARG MESSAGING_SENDER_ID
ARG APP_ID
ARG NEXT_PUBLIC_DATABASE_URL

# Set as environment variables for the build
ENV NEXT_PUBLIC_API_KEY=$NEXT_PUBLIC_API_KEY
ENV AUTH_DOMAIN=$AUTH_DOMAIN
ENV PROJECT_ID=$PROJECT_ID
ENV NEXT_PUBLIC_STORAGE_BUCKET=$NEXT_PUBLIC_STORAGE_BUCKET
ENV MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
ENV APP_ID=$APP_ID
ENV NEXT_PUBLIC_DATABASE_URL=$NEXT_PUBLIC_DATABASE_URL

# Copy deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. Final stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
