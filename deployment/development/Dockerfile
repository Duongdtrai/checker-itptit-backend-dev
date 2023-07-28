FROM node:latest

WORKDIR /itptit-backend

COPY package*.json ./

RUN yarn install

COPY . .

RUN npm run migratedb

EXPOSE 5000

CMD ["npm", "run", "dev"]

ENTRYPOINT [ "sh", "-c", "npm install && npm run dev" ]







