FROM mcr.microsoft.com/playwright:v1.27.0-focal

RUN mkdir -p /app/
WORKDIR /app/

COPY package.*json /app/
RUN yarn install --frozen-lockfile

COPY . /app/
RUN yarn run build