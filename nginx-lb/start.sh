#!/bin/sh

# Replace environment variables in nginx config
envsubst '${ORDER_SERVICE_1_URL} ${ORDER_SERVICE_2_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
nginx -g 'daemon off;'
