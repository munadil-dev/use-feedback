FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml .

COPY prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]
