FROM node:8.11.4
MAINTAINER kino1134

# WORKDIR /opt
# ローカルから最新ソースを取る場合
# COPY . module/
# RUN cd module && yarn install && yarn build
# Gitから最新ソースを取る場合
# ADD package.json /data/
# RUN git clone https://github.com/kino1134/chatta.git \
#   && cd module \
#   && yarn install \
#   && yarn build

# ローカルソースをマウントする
RUN mkdir /opt/module
ADD package.json /opt/module/package.json
WORKDIR /opt/module
RUN yarn install

VOLUME /opt/module

EXPOSE 3000

# WORKDIR /opt/module
CMD ["yarn", "start"]
