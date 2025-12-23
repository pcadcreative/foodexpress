FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Copy nginx config template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Start nginx with environment variable substitution
CMD ["/start.sh"]
