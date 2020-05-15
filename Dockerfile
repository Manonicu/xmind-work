FROM alpine:latest
RUN apk add --no-cache --update nodejs nodejs-npm
ADD . /project
WORKDIR /project
RUN npm install -g nodemon && cd /project && npm install --registry https://registry.npm.taobao.org/
EXPOSE 3333
RUN npm run build
CMD ["nodemon","app.js"]