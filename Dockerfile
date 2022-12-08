FROM node AS publish
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build


EXPOSE 80
ENTRYPOINT [ "npm", "run", "start" ]