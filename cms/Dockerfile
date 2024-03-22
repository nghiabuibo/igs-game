FROM node:18.18.0 as builder

# set working directory
WORKDIR /cms

# install app dependencies
COPY ./package*.json ./
RUN npm install

# copy source code
COPY ./config ./config
COPY ./server.js ./

COPY ./public/robots.txt ./public/robots.txt
COPY ./src ./src
COPY ./types ./types
COPY ./.env* ./
COPY ./tsconfig.json ./tsconfig.json

# build admin
RUN ENV_PATH=/cms/.env.production npm run build --clean

# start server using pm2
RUN npm install pm2 -g
CMD ENV_PATH=/cms/.env.production pm2-runtime start server.js

# start server using forever
# RUN npm install forever -g
# CMD ["forever", "server.js"]