## Simple
FROM node:latest
WORKDIR /src
ADD index.js /src
ADD db.js /src
ADD package.json /src
ADD /controllers /src
ADD /models /src
ADD /node_modules /src
RUN npm i

EXPOSE 3000

ENTRYPOINT ["npm,", "run", "start"]