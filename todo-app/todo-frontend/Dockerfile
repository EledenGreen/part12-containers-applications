FROM node:20 AS test-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run test

FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
ENV VITE_BACKEND_URL=http://localhost:3000
RUN npm run build