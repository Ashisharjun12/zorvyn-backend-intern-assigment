# use node alpine as base image
FROM node:alpine as base

# set the working directory
WORKDIR /app

# copy package files
COPY package*.json ./

# install pnpm globally
RUN npm i -g pnpm 

# install dependencies
RUN pnpm install


# copy the rest of the application code
COPY . .

# build the application
RUN npm run build

# expose the port
EXPOSE 3000

CMD ["npm", "start"]