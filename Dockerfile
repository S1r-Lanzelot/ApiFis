FROM node:18 as nextbuild
WORKDIR /app

COPY fe/.npmrc .npmrc
COPY fe/package.json ./
COPY fe/package-lock.json ./
RUN npm config set fetch-retry-mintimeout 100000 && npm config set fetch-retry-maxtimeout 120000 && npm ci

COPY api-fis/ .
RUN npm run build

ENTRYPOINT ["/"]
