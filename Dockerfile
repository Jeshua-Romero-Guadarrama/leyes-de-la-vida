# ==========================================================================
# Leyes de la Vida — Imagen Docker (sitio estático servido con nginx)
# Autor: Jeshua Romero Guadarrama
# ==========================================================================

FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Leyes de la Vida" \
      org.opencontainers.image.description="Atlas interactivo de leyes epónimas" \
      org.opencontainers.image.authors="Jeshua Romero Guadarrama"

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY index.html sw.js manifest.webmanifest robots.txt sitemap.xml /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/  /usr/share/nginx/html/js/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q --spider http://localhost/ || exit 1
