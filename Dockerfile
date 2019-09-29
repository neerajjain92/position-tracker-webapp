FROM nginx:stable-alpine
LABEL versio="1.0"

COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY dist/PositionTrackerWebApp/ .
