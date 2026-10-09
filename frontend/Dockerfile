# Frontend: React/Vite build, served by nginx.
# Build context is the repository root, because the frontend also uses
# dependencies declared in the root package.json (d3, react-markdown).

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY frontend/package.json frontend/package-lock.json ./frontend/
WORKDIR /app/frontend
RUN npm ci

COPY frontend/ ./
# empty API base: the browser calls /api/... on the same origin and nginx
# forwards these requests to the backend container
ENV VITE_API_BASE=""
RUN npm run build

FROM nginx:1.27-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
