FROM node:12-alpine as base
LABEL description="Base docker file for Breakdown JSON models."

# environment
WORKDIR /usr/src/model

# dependencies
COPY package*.json ./
RUN npm ci

# deployment
CMD ["echo", "This is a base container that is not supposed to be used directly."]

# copy as late as possible to maximize caching
COPY . ./
RUN npm run test
RUN npm run build
