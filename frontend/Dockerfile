# BUILD STAGE
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Production API Gateway URL
ARG VITE_API_BASE_URL=https://api-gateway-27562154208.asia-south1.run.app/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build


# RUNTIME STAGE
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]