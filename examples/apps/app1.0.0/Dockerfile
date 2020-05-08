FROM node:14
LABEL docker build --no-cache -t everis.com.pe/gc-hcmc-kubernetes-demo:1.0.0 .
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ["package.json", "app.js" ,"./"]
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "app.js" ] 