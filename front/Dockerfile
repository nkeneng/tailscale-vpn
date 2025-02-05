FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ARG ENV_FILE

# RUN echo "$ENV_FILE" | base64 -d | sed 's/\\n/\n/g' > .env.local

RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Only copy the essential files from the build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
COPY --from=builder /app/next* ./

EXPOSE 3000

CMD ["npm", "start"]