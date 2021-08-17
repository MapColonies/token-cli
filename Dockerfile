FROM node:16 as build


WORKDIR /tmp/buildApp

COPY ./package*.json ./

RUN npm install
COPY . .
RUN npm run build
RUN npx pkg -t node16-alpine ./dist/package.json

FROM alpine:3.14

COPY --from=build /tmp/buildApp/token-cli /usr/bin/token-cli

ENTRYPOINT [ "token-cli" ]
