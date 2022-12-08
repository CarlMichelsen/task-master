FROM node AS build
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build

FROM build AS publish
COPY --from=build /app/apps/server/dist .

EXPOSE 80
EXPOSE 443
ENTRYPOINT [ "node", "index.js" ]