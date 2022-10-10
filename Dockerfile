FROM mcr.microsoft.com/playwright:v1.27.0-focal

RUN mkdir -p /app/
WORKDIR /app/

COPY package.*json /app/
RUN yarn install --frozen-lockfile

RUN npx playwright install chrome

COPY . /app/
RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]