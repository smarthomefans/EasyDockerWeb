
FROM node:lts-alpine
COPY . /src
RUN apk update && apk add bash && \
    cd /src; yarn install && \
    # Time zone option, if you live in China pleace set it to Asia/Shanghai
    ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
    
EXPOSE  3000
WORKDIR /src
CMD npm start
