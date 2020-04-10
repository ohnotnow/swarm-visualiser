FROM node:12-alpine as build

WORKDIR /home/node
COPY public/index.html public/docker_logo.svg /home/node/public/
COPY package* webpack.mix.js /home/node/
COPY src/* /home/node/src/
RUN npm ci && npm run prod

FROM node:12-alpine as runner

WORKDIR /home/node
COPY --from=build /home/node/public/* /home/node/public/
COPY index.js package* webpack.mix.js /home/node/
RUN npm install --no-dev && npm cache clean --force

CMD ["node", "index.js"]
