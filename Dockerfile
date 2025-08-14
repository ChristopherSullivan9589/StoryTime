FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g http-server

EXPOSE 80

CMD ["http-server", ".", "-p", "80", "-a", "0.0.0.0", "--cors"]

