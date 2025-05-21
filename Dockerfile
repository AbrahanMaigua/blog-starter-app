FROM node:20.12.2-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install 
COPY . .

# RUN npm run build

EXPOSE 3000
# CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "test"]
# CMD ["npm", "run", "build"]
# CMD ["npm", "run", "lint"]