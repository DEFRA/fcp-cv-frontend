ARG PARENT_VERSION=latest-24
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
COPY --chown=node:node server.js ./server.js

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
COPY --from=development /home/node/package*.json ./
COPY --from=development /home/node/.next ./.next
COPY --from=development /home/node/server.js ./
COPY --from=development /home/node/next.config.js ./

RUN npm ci --omit=dev

ARG PORT
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["node", "server.js"]
