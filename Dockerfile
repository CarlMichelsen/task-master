FROM node AS build
WORKDIR /app
RUN chmod 755 /app
COPY ./ ./
RUN npm install
RUN npm run build
RUN rm -drf ./node_modules
RUN npm install --omit=dev

FROM build AS publish
RUN useradd -ms /bin/bash admin
WORKDIR /app
RUN rm -rdivf ./*
COPY --from=build /app/apps/server/dist/ ./
COPY --from=build /app/node_modules/ ./node_modules/

EXPOSE 80
EXPOSE 443
ENTRYPOINT [ "node", "index.js" ]