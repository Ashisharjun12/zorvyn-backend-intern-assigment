# use node alpine as base image
FROM node:22-alpine as base

# set the working directory
WORKDIR /app

# copy package and lock files
COPY package.json pnpm-lock.yaml ./

# install pnpm globally
RUN npm i -g pnpm 

# install dependencies
RUN pnpm install --frozen-lockfile


# copy the rest of the application code
COPY . .

# build the application
RUN npm run build

# expose the port
EXPOSE 3000

CMD ["npm", "start"]