# Используем официальный Node.js 18
FROM node:18


WORKDIR /app


COPY package*.json ./


RUN npm install --unsafe-perm --allow-root


RUN npm install -g prisma


COPY . .


RUN npm run build


RUN npx prisma generate --schema=prisma/pending.schema.prisma
RUN npx prisma generate --schema=prisma/ru.schema.prisma
RUN npx prisma generate --schema=prisma/other.schema.prisma

RUN npx prisma db push --schema=prisma/pending.schema.prisma
RUN npx prisma db push --schema=prisma/ru.schema.prisma
RUN npx prisma db push --schema=prisma/other.schema.prisma


EXPOSE 3001


CMD ["sh", "-c", "node dist/src/main.js || echo '⚠️ Service crashed, but staying alive...' && tail -f /dev/null"]