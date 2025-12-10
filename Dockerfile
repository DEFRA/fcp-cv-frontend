ARG PARENT_VERSION=2.10.1-node24.11.1
ARG PORT=3000
ARG PORT_DEBUG=9229

FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}

ENV TZ="Europe/London"
ENV NEXT_TELEMETRY_DISABLED=1

ARG PORT
ARG PORT_DEBUG
ENV PORT=${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node next.config.js postcss.config.js ./
COPY --chown=node:node app ./app

RUN NODE_ENV=production npm run build

CMD [ "npm", "run", "dev" ]

FROM defradigital/node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node:${PARENT_VERSION}

ENV TZ="Europe/London"
ENV NEXT_TELEMETRY_DISABLED=1

# Add curl to template.
# CDP PLATFORM HEALTHCHECK REQUIREMENT
USER root
RUN apk add --no-cache curl

USER node
COPY --from=development /home/node/.next/standalone ./
COPY --from=development /home/node/.next/static ./.next/static

ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
