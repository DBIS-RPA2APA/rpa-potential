# Backend: Express API + evaluation pipeline
FROM node:22-alpine

# git is only used to record the commit hash of the code in every run log
# (the repository's .git folder is mounted read-only, see docker-compose.yml)
RUN apk add --no-cache git \
    && git config --system --add safe.directory '*'

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "src/server.js"]
