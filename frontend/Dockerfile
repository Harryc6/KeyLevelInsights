FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json vite.config.ts index.html postcss.config.cjs ./
COPY public ./public
COPY src ./src

ARG VITE_BACKEND_API_URL=/api
ENV VITE_BACKEND_API_URL=${VITE_BACKEND_API_URL}

RUN npm ci
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

