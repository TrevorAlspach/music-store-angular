FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli@18.0.2
RUN ng build --configuration development
#RUN ng v

FROM nginx:alpine
#RUN apk update && apk add bash
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/music-store-angular /usr/share/nginx/html
RUN nginx
EXPOSE 80