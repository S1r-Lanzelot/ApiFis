FROM node:18 as nextbuild
WORKDIR /app

COPY api-fis/.npmrc .npmrc
COPY api-fis/package.json ./
COPY api-fis/package-lock.json ./
RUN npm config set fetch-retry-mintimeout 100000 && npm config set fetch-retry-maxtimeout 120000 && npm ci

COPY api-fis/ .
RUN npm run build

ENTRYPOINT ["/"]
