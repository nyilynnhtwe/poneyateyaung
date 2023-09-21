FROM node
RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install -g prisma
RUN npm install -g @nestjs/cli
RUN npm install
COPY . .