FROM node:10.21-alpine3.11 as builder

RUN apk add --no-cache python3 git make build-base
WORKDIR /usr/src/app
COPY package.json ./

RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build:dev

FROM nginx:1.18-alpine

COPY --from=builder /usr/src/app/dist/app/ /usr/share/nginx/html
EXPOSE 80