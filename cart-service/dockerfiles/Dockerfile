FROM node:12-alpine as build
WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . ./
RUN npm run build


FROM node:12-alpine
WORKDIR '/app'
COPY --from=build /app/dist /app/dist

# Application
USER node
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main.js"]