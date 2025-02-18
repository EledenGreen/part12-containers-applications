FROM node:20
WORKDIR /usr/src/app
COPY --chown=node:node . .
COPY . .
RUN npm ci
USER node
CMD [ "npm","run", "start:prod" ]