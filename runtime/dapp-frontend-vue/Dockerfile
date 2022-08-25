#
# This file is part of dHealth dApps Framework shared under LGPL-3.0
# Copyright (C) 2022-present dHealth Network, All rights reserved.
#
# @package     dHealth dApps Framework
# @subpackage  Deployment
# @author      dHealth Network <devs@dhealth.foundation>
# @license     LGPL-3.0
#
# Production main
FROM node:16.13.1-alpine3.15 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --no-cache build-base \
  g++ \
  python3 \
  py3-pip \
  pkgconfig \
  cairo-dev \
  jpeg-dev \
  pango-dev \
  giflib-dev
RUN npm install -g lerna
RUN npm install
COPY . .
RUN npm run build

# the following command directive is only
# necessary if you wish to run this app
# directly from the Dockerfile.
# in our dapps-framework, we use docker
# compose for this and pass the command
# there instead (with environment conf).
# CMD ["serve", "-s", "dist", "-l", "80"]
