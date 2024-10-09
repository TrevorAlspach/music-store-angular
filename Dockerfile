FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli@18.0.2
RUN ng build --configuration production
#RUN ng v

FROM jonasal/nginx-certbot:5.2.1
ENV CERTBOT_EMAIL=trevoralspach@gmail.com
ENV STAGING=1
ENV DEBUG=1

#RUN apk update && apk add bash
#RUN apk add bash
#COPY nginx.conf /etc/nginx/nginx.conf
COPY user.conf /etc/nginx/user_conf.d/user.conf
COPY --from=node /app/dist/music-store-angular /usr/share/nginx/html
#RUN nginx
EXPOSE 80 443