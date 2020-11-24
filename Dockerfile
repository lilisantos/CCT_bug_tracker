## Simple
FROM node:14
WORKDIR /src
COPY ./src ./src
COPY package.json .
RUN npm i

EXPOSE 3000

ENTRYPOINT ["npm,", "run", "start"]
