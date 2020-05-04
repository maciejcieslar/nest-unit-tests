FROM node:13.12-alpine AS development

RUN apk --no-cache add --virtual builds-deps build-base python

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:13.12-alpine AS production

RUN apk --no-cache add --virtual builds-deps build-base python

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/main"]
