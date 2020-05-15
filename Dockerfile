FROM alpine:latest
ADD . /project
WORKDIR /project
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache --update nodejs-current nodejs-npm
RUN npm install -g nodemon --verbose && \
    cd /project && \
    npm install --registry https://registry.npm.taobao.org/ --verbose && \
    npm run build
EXPOSE 3333
CMD ["nodemon","app.js"]