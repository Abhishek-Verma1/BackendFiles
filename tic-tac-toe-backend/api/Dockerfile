# Base image
FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "start"]