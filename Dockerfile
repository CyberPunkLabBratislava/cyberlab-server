FROM node:8-alpine

RUN addgroup -g 9999 app && adduser -u 9999 -G app -D app -s /bin/bash \
    && apk upgrade --update \
    && apk add --no-cache \
       bash bash-completion \
       git curl shadow


ENV HOME=/home/app/
WORKDIR $HOME

# Bundle APP files
COPY server .
RUN chown -R app:app /home/app/ && \
    mkdir /home/app/logs && \
    chmod -R 777 /home/app/logs

USER app

RUN mkdir -p /home/app/.npm-global/bin \
    && npm config set prefix '/home/app/.npm-global' \
    && npm install -g pm2

ENV PATH=/home/app/.npm-global/bin:${PATH}

# Install app dependencies
RUN npm install >/dev/null 2>&1

# Install and configure log-rotate
RUN pm2 install pm2-logrotate >/dev/null 2>&1 \
    && pm2 set pm2-logrotate:max_size 10M >/dev/null 2>&1 \
    && pm2 set pm2-logrotate:compress true >/dev/null 2>&1 \
    && pm2 set pm2-logrotate:retain 7 >/dev/null 2>&1

# Expose the listening port of your app
EXPOSE 3000

# Run node app
CMD pm2-runtime start --env development server.config.js
