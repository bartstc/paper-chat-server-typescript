FROM node

WORKDIR /paper-chat-server-typescript/server

COPY ./package.json .

RUN npm install --production

COPY ./build ./build
COPY ./client ./client
COPY ./.env.prod ./.env

# WORKDIR ./server

RUN ls

ENV NODE_ENV production

EXPOSE 5000

CMD ["node", "build/server.js"]

# docker build -t bartoszstolc/paperchat-server:1.0.0 .
# docker build --no-cache -t bartoszstolc/paperchat-server:1.0.0 . // rebuild
# docker run -it bartoszstolc/paperchat-server:1.0.0 sh
# docker run -p 5000:5000 --net="host" bartoszstolc/paperchat-server:1.0.0 // when localhost
# docker run -p 5000:5000 bartoszstolc/paperchat-server:1.0.0 // when remote host

# docker ps
# docker stop <container id>