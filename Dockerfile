FROM nginx:latest
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /var/www/
EXPOSE 80