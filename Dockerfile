# ## Simple
# FROM node:14
# WORKDIR /src
# COPY ./src ./src
# COPY package.json .
# COPY index.js .
# COPY db.js .
# RUN npm i

# EXPOSE 3000

# ENTRYPOINT ["npm,", "run", "start"]

FROM node:14.15.0
WORKDIR /src
COPY . /src/
COPY package.json /src/
COPY index.js /src/
COPY db.js /src/
RUN npm i
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]

