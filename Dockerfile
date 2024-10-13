# Production Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

# CMD ["sh", "-c", "npm run prisma:migrate:deploy && npm run start:prod"]
CMD ["sh", "-c", "npm run prisma:migrate:deploy && npm run prisma:seed && npm run start:prod"]
