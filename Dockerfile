FROM node:22-alpine AS builder

ARG NEXT_PUBLIC_SERVER_API
ENV NEXT_PUBLIC_SERVER_API=$NEXT_PUBLIC_SERVER_API

WORKDIR /frontend

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /frontend

ENV NODE_ENV=production

COPY --from=builder /frontend/.next/standalone ./
COPY --from=builder /frontend/.next/static ./.next/static
COPY --from=builder /frontend/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
