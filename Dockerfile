FROM node:lts-alpine3.20 AS deps
WORKDIR /home/node/app
COPY package.json ./
RUN npm install

FROM node:lts-alpine3.20 AS builder
WORKDIR /home/node/app
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV production
RUN npm install --only=production

FROM node:lts-alpine3.20 AS runner
WORKDIR /home/node/app
RUN mkdir -p /home/node/app/logs && chown -R node:node /home/node/app/logs
COPY package.json ./
COPY --from=builder --chown=node:node /home/node/app/dist ./dist
COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules
USER node

CMD ["node", "dist/main.js"]