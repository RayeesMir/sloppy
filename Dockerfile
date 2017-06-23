FROM node:8.1.0-onbuild

VOLUME /code
WORKDIR /code
RUN npm install

CMD ["npm", "start"]
