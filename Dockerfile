FROM node AS install
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM install AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM build AS publish
COPY ./dist-webserver/ .
EXPOSE 8080
ENTRYPOINT [ "node", "index.js" ]