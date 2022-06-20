# Development
FROM node:16.13.1-alpine3.15 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

# development uses basic environment settings
COPY .env-sample .env

RUN npm run build

# Production main
FROM node:16.13.1-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

# Note on production
# production build does not include an overwrite of .env with .env-sample
# this step must instead be execute manually such that *before* the build
# is executed, a `.env` file is present in the root folder of the software.

COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]
