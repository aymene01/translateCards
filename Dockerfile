FROM node:18-alpine

ENV NODE_ENV=development

# Install git, which might be needed for fetching some dependencies
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY turbo.json ./

COPY . .

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

RUN pnpm turbo run build

CMD [ "pnpm", "dev" ]

EXPOSE 8080