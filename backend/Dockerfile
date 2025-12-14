FROM node:18-alpine

WORKDIR /app

# Copiamos SOLO backend/package.json
COPY backend/package*.json ./

RUN npm install

# Copiamos todo el backend
COPY backend/ .

EXPOSE 3000

CMD ["npm", "start"]
