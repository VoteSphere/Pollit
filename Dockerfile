FROM node:alpine as builder
WORKDIR /app

COPY types/ types/
COPY client/src client/src
COPY client/public client/public
COPY client/tsconfig.json client/tsconfig.json
COPY client/webpack.config.js client/webpack.config.js
COPY server/tsconfig.json server/tsconfig.json
COPY server/src server/src
COPY package*.json .

RUN npm ci
RUN npm run build


FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder app/client/dist client/dist
COPY --from=builder app/server/dist server/dist
COPY --from=builder app/package*.json .
RUN npm ci

EXPOSE 3000
CMD ["node", "server/dist/server.js"]