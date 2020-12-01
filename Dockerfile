#DICKERFILE
FROM node:12
RUN mkdir ./src
WORKDIR ./src/

COPY package*.json ./
COPY . ./
RUN npm install
ENV TYPE MASTER
RUN echo $TYPE
RUN ls
EXPOSE 3000
CMD ["node","node.js","input1"]


